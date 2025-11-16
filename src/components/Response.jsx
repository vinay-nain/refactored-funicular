function getType(data, headers) {
    const contentType = headers?.["content-type"]?.toLowerCase() || "";
    if (contentType.includes("application/json")) return "json";
    if (contentType.includes("text/html")) return "html";
    if (contentType.includes("text/plain")) return "text";
    return "unknown";
}

function JsonView({ data }) {
    return <pre>{JSON.stringify(data, null, 4)}</pre>;
}

function HtmlView({ data }) {
    return <iframe srcDoc={data} sandbox="" />;
}

function TextView({ data }) {
    return <pre>{data}</pre>;
}

function getStatusColor(status) {
    if (status >= 100 && status < 200) return "gray";
    if (status >= 200 && status < 300) return "#39FF14";
    if (status >= 300 && status < 400) return "cornflowerblue";
    if (status >= 400 && status < 500) return "orange";
    if (status >= 500 && status < 600) return "red";
    return "gray";
}

export default function Response({ response, time, error }) {
    const isError = Boolean(error);
    const status = isError ? error?.response?.status : response?.status;
    const data = isError ? error?.response?.data : response?.data;
    const statusColor = getStatusColor(status);
    const type = getType(data, response?.headers);

    const renderPreview = () => {
        switch (type) {
            case "json":
                return <JsonView data={data} />;
            case "text":
                return <TextView data={data} />;
            case "html":
                return <HtmlView data={data} />;
            default:
                return (
                    <pre>
                        {typeof data === "string"
                            ? data
                            : JSON.stringify(data, null, 2)}
                    </pre>
                );
        }
    };

    return (
        <div>
            <div className="response">
                <div
                    className="response-header"
                    style={{
                        color: statusColor,
                        fontSize: ".7rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span style={{ color: "white" }}>
                        {isError ? "Error:" : "Status:"}
                    </span>

                    <span>{status ?? "-"}</span>

                    {(response || error) && (
                        <i
                            className="fa-solid fa-circle"
                            style={{ fontSize: ".4rem" }}
                        ></i>
                    )}

                    <span style={{ color: "white", marginLeft: "16px" }}>
                        Time:
                    </span>
                    <span>{Math.round(time)}ms</span>
                </div>
                <div
                    style={{
                        marginTop: "6px",
                        whiteSpace: "pre-wrap",
                        width: "100%",
                    }}
                >
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
}
