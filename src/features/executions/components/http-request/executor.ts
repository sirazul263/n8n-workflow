import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const result = await step.run("http-request", async () => {
    if (!data.endpoint) {
      await publish(
        httpRequestChannel().status({
          nodeId,
          status: "error",
        })
      );

      throw new NonRetriableError("Http Request Node : No endpoint configured");
    }

    if (!data.variableName) {
      await publish(
        httpRequestChannel().status({
          nodeId,
          status: "error",
        })
      );
      throw new NonRetriableError(
        "Http Request Node : No variable name configured"
      );
    }

    if (!data.method) {
      await publish(
        httpRequestChannel().status({
          nodeId,
          status: "error",
        })
      );

      throw new NonRetriableError("Http Request Node : No method configured");
    }

    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method.toUpperCase();

    // Initialize fetch options
    const options: RequestInit = { method, headers: {} };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      let resolvedBody = "{}";

      try {
        resolvedBody = data.body
          ? Handlebars.compile(data.body)(context)
          : "{}";

        // Now JSON validation works
        const parsedBody = JSON.parse(resolvedBody);

        options.body = JSON.stringify(parsedBody);
        options.headers = {
          "Content-Type": "application/json",
        };
      } catch (err) {
        console.log("Error resolving Handlebars or JSON", err);

        await publish(
          httpRequestChannel().status({
            nodeId,
            status: "error",
          })
        );

        throw new NonRetriableError("Http Request Node: Invalid JSON body");
      }
    }

    // Perform the request
    let response: Response;
    try {
      response = await fetch(endpoint, options);
    } catch (err) {
      console.error(
        `[HTTP Request] Node ${data.variableName} | Fetch failed:`,
        err
      );

      await publish(
        httpRequestChannel().status({
          nodeId,
          status: "error",
        })
      );
      throw new NonRetriableError(`Http Request Node: Request failed - ${err}`);
    }

    // Parse response
    const contentType = response.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "success",
    })
  );

  return result;
};
