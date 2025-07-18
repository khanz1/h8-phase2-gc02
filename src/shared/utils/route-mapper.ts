import { Application } from "express";
import { Logger } from "@/config/logger";

interface RouteInfo {
  method: string;
  path: string;
  middlewares: string[];
  access: string;
  description?: string;
}

interface RouteGroup {
  prefix: string;
  description: string;
  routes: RouteInfo[];
}

export class RouteMapper {
  private readonly logger = Logger.getInstance();

  public mapRoutes(app: Application): void {
    this.logger.info("🗺️  === APPLICATION ROUTE MAPPING ===");
    this.logger.info("");

    const routes = this.extractRoutesFromApp(app);
    const groupedRoutes = this.groupRoutes(routes);

    this.displayRoutes(groupedRoutes);
    this.displaySummary(groupedRoutes);

    this.logger.info("🗺️  === END ROUTE MAPPING ===");
    this.logger.info("");
  }

  private extractRoutesFromApp(app: Application): RouteInfo[] {
    const routes: RouteInfo[] = [];

    const stack = app._router?.stack || [];

    this.extractFromStack(stack, "", routes, []);

    return routes.sort((a, b) => {
      if (a.path === b.path) {
        const methodOrder = ["GET", "POST", "PUT", "PATCH", "DELETE"];
        return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
      }
      return a.path.localeCompare(b.path);
    });
  }

  private extractFromStack(
    stack: any[],
    basePath: string,
    routes: RouteInfo[],
    inheritedMiddlewares: string[] = []
  ): void {
    stack.forEach((layer) => {
      if (layer.route) {
        this.extractRoute(layer, basePath, routes, inheritedMiddlewares);
      } else if (layer.name === "router" && layer.handle?.stack) {
        const routerPath = this.extractRouterPath(layer, basePath);
        const routerMiddlewares = this.extractRouterMiddlewares(layer);
        const combinedMiddlewares = [
          ...inheritedMiddlewares,
          ...routerMiddlewares,
        ];
        this.extractFromStack(
          layer.handle.stack,
          routerPath,
          routes,
          combinedMiddlewares
        );
      } else if (layer.name === "app" && layer.handle?.stack) {
        this.extractFromStack(
          layer.handle.stack,
          basePath,
          routes,
          inheritedMiddlewares
        );
      } else {
        const middlewareName = this.identifyMiddleware(layer);
        if (middlewareName) {
          const newInheritedMiddlewares = [
            ...inheritedMiddlewares,
            middlewareName,
          ];
        }
      }
    });
  }

  private extractRoute(
    layer: any,
    basePath: string,
    routes: RouteInfo[],
    inheritedMiddlewares: string[] = []
  ): void {
    const route = layer.route;
    const fullPath = basePath + route.path;

    Object.keys(route.methods).forEach((method) => {
      if (route.methods[method]) {
        const routeMiddlewares = this.extractMiddlewareNames(route.stack);
        const allMiddlewares = [
          ...new Set([...inheritedMiddlewares, ...routeMiddlewares]),
        ];
        const access = this.determineAccessLevel(allMiddlewares, fullPath);

        routes.push({
          method: method.toUpperCase(),
          path: this.normalizePath(fullPath),
          middlewares: allMiddlewares,
          access,
          description: this.generateDescription(
            method.toUpperCase(),
            fullPath,
            allMiddlewares
          ),
        });
      }
    });
  }

  private extractRouterPath(layer: any, basePath: string): string {
    const regexSource = layer.regexp.source;

    if (regexSource.includes("\\/api\\/auth")) {
      return basePath + "/api/auth";
    }
    if (regexSource.includes("\\/apis\\/blog")) {
      return basePath + "/apis/blog";
    }
    if (regexSource.includes("\\/apis\\/pub\\/blog")) {
      return basePath + "/apis/pub/blog";
    }
    if (regexSource.includes("\\/apis\\/careers")) {
      return basePath + "/apis/careers";
    }
    if (regexSource.includes("\\/apis\\/pub\\/careers")) {
      return basePath + "/apis/pub/careers";
    }
    if (regexSource.includes("\\/apis\\/movies")) {
      return basePath + "/apis/movies";
    }
    if (regexSource.includes("\\/apis\\/pub\\/movies")) {
      return basePath + "/apis/pub/movies";
    }
    if (regexSource.includes("\\/apis\\/news")) {
      return basePath + "/apis/news";
    }
    if (regexSource.includes("\\/apis\\/pub\\/news")) {
      return basePath + "/apis/pub/news";
    }
    if (regexSource.includes("\\/apis\\/products")) {
      return basePath + "/apis/products";
    }
    if (regexSource.includes("\\/apis\\/pub\\/products")) {
      return basePath + "/apis/pub/products";
    }
    if (regexSource.includes("\\/apis\\/rentals")) {
      return basePath + "/apis/rentals";
    }
    if (regexSource.includes("\\/apis\\/pub\\/rentals")) {
      return basePath + "/apis/pub/rentals";
    }

    const pathMatch = regexSource.match(/\\?\/([\w\-\\\/]+)/);
    if (pathMatch) {
      const extractedPath =
        "/" + pathMatch[1].replace(/\\\//g, "/").replace(/\\/g, "");
      return basePath + extractedPath;
    }

    return basePath;
  }

  private extractRouterMiddlewares(layer: any): string[] {
    const middlewares: string[] = [];

    const regexSource = layer.regexp.source;

    if (regexSource.includes("\\/api\\/auth")) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/blog") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/careers") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/movies") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/news") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/products") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    } else if (
      regexSource.includes("\\/apis\\/rentals") &&
      !regexSource.includes("\\/pub\\/")
    ) {
      middlewares.push("authenticate");
    }

    return middlewares;
  }

  private identifyMiddleware(layer: any): string | null {
    if (layer.name && layer.name !== "<anonymous>") {
      const name = layer.name.toLowerCase();
      if (name.includes("auth")) return "authenticate";
      if (name.includes("cors")) return "cors";
      if (name.includes("helmet")) return "helmet";
      if (name.includes("morgan")) return "morgan";
      if (name.includes("json")) return "bodyParser";
    }

    if (layer.handle?.toString) {
      const handlerStr = layer.handle.toString();
      if (handlerStr.includes("authenticate")) return "authenticate";
      if (handlerStr.includes("cors")) return "cors";
      if (handlerStr.includes("helmet")) return "helmet";
    }

    return null;
  }

  private extractMiddlewareNames(stack: any[]): string[] {
    if (!stack) return [];

    const middlewares: string[] = [];

    stack.forEach((layer, index) => {
      if (index === stack.length - 1) return;

      if (layer.name && layer.name !== "<anonymous>" && layer.name !== "next") {
        middlewares.push(layer.name);
      } else if (layer.handle?.name && layer.handle.name !== "<anonymous>") {
        middlewares.push(layer.handle.name);
      }

      if (layer.handle?.toString) {
        const handlerStr = layer.handle.toString();

        if (
          handlerStr.includes("authenticate") ||
          handlerStr.includes("AuthMiddleware")
        ) {
          middlewares.push("authenticate");
        }

        if (
          handlerStr.includes("requireAdmin") ||
          handlerStr.includes("admin")
        ) {
          middlewares.push("requireAdmin");
        }
        if (
          handlerStr.includes("requireStaff") ||
          handlerStr.includes("staff")
        ) {
          middlewares.push("requireStaff");
        }
        if (handlerStr.includes("requireAdminOrStaff")) {
          middlewares.push("requireAdminOrStaff");
        }
        if (
          handlerStr.includes("requireOwnership") ||
          handlerStr.includes("ownership")
        ) {
          middlewares.push("requireOwnership");
        }

        if (
          handlerStr.includes("multer") ||
          handlerStr.includes("upload") ||
          handlerStr.includes("singleImage")
        ) {
          middlewares.push("fileUpload");
        }

        if (handlerStr.includes("cors")) {
          middlewares.push("cors");
        }
        if (handlerStr.includes("helmet")) {
          middlewares.push("helmet");
        }
        if (handlerStr.includes("rateLimit")) {
          middlewares.push("rateLimit");
        }
      }

      if (layer.handle?.constructor?.name) {
        const constructorName = layer.handle.constructor.name;
        if (constructorName.includes("AuthMiddleware")) {
          middlewares.push("authenticate");
        }
        if (constructorName.includes("AuthorizationMiddleware")) {
          middlewares.push("authorization");
        }
        if (constructorName.includes("UploadMiddleware")) {
          middlewares.push("fileUpload");
        }
      }
    });

    return [...new Set(middlewares)].filter(
      (name) =>
        ![
          "bound",
          "layer",
          "router",
          "trim_prefix",
          "next",
          "dispatch",
        ].includes(name)
    );
  }

  private determineAccessLevel(middlewares: string[], path: string): string {
    if (middlewares.includes("authenticate")) {
      if (middlewares.includes("requireAdmin")) {
        return "Admin Only";
      }
      if (
        middlewares.includes("requireStaff") ||
        middlewares.includes("requireAdminOrStaff")
      ) {
        if (middlewares.includes("requireOwnership")) {
          return "Admin/Staff + Ownership";
        }
        return "Admin/Staff Only";
      }
      if (middlewares.includes("requireOwnership")) {
        return "Authenticated + Ownership";
      }
      return "Authenticated Users";
    }
    return "Public";
  }

  private generateDescription(
    method: string,
    path: string,
    middlewares: string[]
  ): string {
    if (path === "/") {
      return "API root endpoint with basic information";
    }
    if (path === "/health") {
      return "Health check endpoint for monitoring";
    }
    if (path.includes("/login")) {
      return "User login with email/username and password";
    }
    if (path.includes("/add-user")) {
      return "Create new user account";
    }
    if (path.includes("/categories")) {
      if (method === "GET" && path.includes("/:id")) {
        return "Get specific blog category by ID";
      }
      if (method === "GET") {
        return "Get all blog categories";
      }
      if (method === "POST") {
        return "Create new blog category";
      }
      if (method === "PUT") {
        return "Update existing blog category";
      }
      if (method === "DELETE") {
        return "Delete blog category";
      }
    }
    if (path.includes("/posts")) {
      if (method === "GET" && path.includes("/:id")) {
        const isPublic = path.includes("/pub/");
        return `Get specific ${isPublic ? "published " : ""}blog post${
          isPublic ? " (public)" : " by ID"
        }`;
      }
      if (method === "GET") {
        const isPublic = path.includes("/pub/");
        return `Get all ${isPublic ? "published " : ""}blog posts${
          isPublic ? " (public)" : ""
        }`;
      }
      if (method === "POST") {
        return "Create new blog post";
      }
      if (method === "PUT") {
        return "Update existing blog post";
      }
      if (method === "PATCH") {
        if (middlewares.includes("fileUpload") || path.includes("image")) {
          return "Update blog post image";
        }
        return "Partially update blog post";
      }
      if (method === "DELETE") {
        return "Delete blog post";
      }
    }

    const resource = this.extractResourceName(path);
    switch (method) {
      case "GET":
        return path.includes("/:id")
          ? `Get specific ${resource} by ID`
          : `Get all ${resource}`;
      case "POST":
        return `Create new ${resource}`;
      case "PUT":
        return `Update existing ${resource}`;
      case "PATCH":
        return `Partially update ${resource}`;
      case "DELETE":
        return `Delete ${resource}`;
      default:
        return `${method} operation on ${resource}`;
    }
  }

  private extractResourceName(path: string): string {
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment?.startsWith(":")) {
      return segments[segments.length - 2] || "resource";
    }

    return lastSegment || "resource";
  }

  private normalizePath(path: string): string {
    return (
      path
        .replace(/\\/g, "")
        .replace(/\?\$.*$/, "")
        .replace(/\(\?\:.*?\)/g, "")
        .replace(/\$/, "")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "") || "/"
    );
  }

  private groupRoutes(routes: RouteInfo[]): RouteGroup[] {
    const groups: { [key: string]: RouteInfo[] } = {};

    routes.forEach((route) => {
      const groupInfo = this.determineRouteGroup(route.path);

      if (!groups[groupInfo.key]) {
        groups[groupInfo.key] = [];
      }
      groups[groupInfo.key].push(route);
    });

    const routeGroups = Object.entries(groups).map(([groupKey, routeList]) => {
      const groupInfo = this.getGroupInfo(groupKey, routeList);
      return {
        prefix: groupInfo.prefix,
        description: groupInfo.description,
        routes: routeList.sort(this.sortRoutesWithinGroup),
      };
    });

    return routeGroups.sort((a, b) => {
      const aPriority = this.getGroupPriority(a.prefix);
      const bPriority = this.getGroupPriority(b.prefix);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.prefix.localeCompare(b.prefix);
    });
  }

  private determineRouteGroup(path: string): { key: string; basePath: string } {
    if (path === "/" || path === "/health") {
      return { key: "system", basePath: "" };
    }

    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      return { key: "system", basePath: "" };
    }

    if (segments[0] === "api") {
      const secondSegment = segments[1] || "general";
      return {
        key: `api-${secondSegment}`,
        basePath: `/api/${secondSegment}`,
      };
    } else if (segments[0] === "apis") {
      if (segments[1] === "pub") {
        const thirdSegment = segments[2] || "general";
        return {
          key: `public-${thirdSegment}`,
          basePath: `/apis/pub/${thirdSegment}`,
        };
      } else {
        const secondSegment = segments[1] || "general";
        return {
          key: `apis-${secondSegment}`,
          basePath: `/apis/${secondSegment}`,
        };
      }
    } else {
      const firstSegment = segments[0];
      return {
        key: `other-${firstSegment}`,
        basePath: `/${firstSegment}`,
      };
    }
  }

  private getGroupInfo(
    groupKey: string,
    routes: RouteInfo[]
  ): { prefix: string; description: string } {
    const sampleRoute = routes[0];
    const basePath = this.determineRouteGroup(sampleRoute.path).basePath;

    switch (groupKey) {
      case "system":
        return {
          prefix: "System Routes",
          description: "Core application endpoints (health, root, etc.)",
        };
      case "api-auth":
        return {
          prefix: `Authentication (${basePath})`,
          description: "User authentication and session management",
        };
      case "apis-blog":
        return {
          prefix: `Blog Management (${basePath})`,
          description: "Authenticated blog content management",
        };
      case "public-blog":
        return {
          prefix: `Public Blog (${basePath})`,
          description: "Public blog content access",
        };
      default:
        const displayName = this.generateDisplayName(groupKey, basePath);
        const description = this.generateGroupDescription(groupKey, routes);
        return {
          prefix: `${displayName} (${basePath})`,
          description,
        };
    }
  }

  private generateDisplayName(groupKey: string, basePath: string): string {
    const parts = groupKey.split("-");

    if (parts[0] === "api") {
      return `${this.capitalizeFirst(parts[1])} API`;
    } else if (parts[0] === "apis") {
      return `${this.capitalizeFirst(parts[1])} Management`;
    } else if (parts[0] === "public") {
      return `Public ${this.capitalizeFirst(parts[1])}`;
    } else if (parts[0] === "other") {
      return this.capitalizeFirst(parts[1]);
    }

    return basePath
      .split("/")
      .filter(Boolean)
      .map(this.capitalizeFirst)
      .join(" ");
  }

  private generateGroupDescription(
    groupKey: string,
    routes: RouteInfo[]
  ): string {
    const parts = groupKey.split("-");
    const resourceName = parts[parts.length - 1];

    const hasPublicAccess = routes.some((r) => r.access === "Public");
    const hasAuthAccess = routes.some((r) =>
      r.access.includes("Authenticated")
    );
    const hasAdminAccess = routes.some((r) => r.access.includes("Admin"));

    let accessDescription = "";
    if (hasPublicAccess && hasAuthAccess) {
      accessDescription = "public and authenticated access";
    } else if (hasPublicAccess) {
      accessDescription = "public access";
    } else if (hasAdminAccess) {
      accessDescription = "administrative access";
    } else if (hasAuthAccess) {
      accessDescription = "authenticated access";
    } else {
      accessDescription = "access";
    }

    if (parts[0] === "public") {
      return `Public ${resourceName} content and information`;
    } else if (parts[0] === "api") {
      return `${this.capitalizeFirst(
        resourceName
      )} API endpoints with ${accessDescription}`;
    } else if (parts[0] === "apis") {
      return `${this.capitalizeFirst(
        resourceName
      )} management with ${accessDescription}`;
    }

    return `${this.capitalizeFirst(
      resourceName
    )} endpoints with ${accessDescription}`;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private sortRoutesWithinGroup = (a: RouteInfo, b: RouteInfo): number => {
    if (a.path === b.path) {
      const methodOrder = ["GET", "POST", "PUT", "PATCH", "DELETE"];
      return methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);
    }
    return a.path.localeCompare(b.path);
  };

  private getGroupPriority(prefix: string): number {
    if (prefix.includes("System")) return 1;
    if (prefix.includes("Authentication")) return 2;
    if (prefix.includes("Public")) return 99;
    return 50;
  }

  private displayRoutes(routeGroups: RouteGroup[]): void {
    routeGroups.forEach((group) => {
      this.logger.info(`📁 ${group.prefix}`);
      this.logger.info(`   ${group.description}`);
      this.logger.info("");

      if (group.routes.length === 0) {
        this.logger.info("   (No routes found)");
      } else {
        group.routes.forEach((route) => {
          const methodColor = this.getMethodColor(route.method);
          const middlewareInfo =
            route.middlewares.length > 0
              ? ` [${route.middlewares.join(", ")}]`
              : "";
          const accessInfo =
            route.access !== "Public" ? ` (${route.access})` : "";

          this.logger.info(
            `   ${methodColor} ${route.path}${middlewareInfo}${accessInfo}`
          );
          if (route.description) {
            this.logger.info(`      ↳ ${route.description}`);
          }
        });
      }
      this.logger.info("");
    });
  }

  private displaySummary(routeGroups: RouteGroup[]): void {
    const allRoutes = routeGroups.flatMap((group) => group.routes);
    const methodCounts = allRoutes.reduce((acc, route) => {
      acc[route.method] = (acc[route.method] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const accessCounts = allRoutes.reduce((acc, route) => {
      acc[route.access] = (acc[route.access] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.logger.info("📊 Route Summary:");
    this.logger.info(`   Total Routes: ${allRoutes.length}`);
    this.logger.info(`   Total Route Groups: ${routeGroups.length}`);
    this.logger.info("");

    this.logger.info("   By HTTP Method:");
    Object.entries(methodCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([method, count]) => {
        this.logger.info(`     ${method}: ${count} routes`);
      });

    this.logger.info("");
    this.logger.info("   By Access Level:");
    Object.entries(accessCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([access, count]) => {
        this.logger.info(`     ${access}: ${count} routes`);
      });
  }

  private getMethodColor(method: string): string {
    const colors: { [key: string]: string } = {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      PATCH: "PATCH",
      DELETE: "DELETE",
    };
    return colors[method] || `${method}`;
  }
}
