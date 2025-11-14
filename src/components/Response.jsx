import React from "react";

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
                    }}
                >
                    {data && JSON.stringify(data, null, 2)}
                </div>
            </div>
        </div>
    );
}
