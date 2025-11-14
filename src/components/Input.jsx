import { useEffect, useState, useRef } from "react";
import Response from "./Response";
import axios from "axios";
import Method from "./Method";
import "./Input.css";

export default function Input({ tabId, data = {}, onChangeData }) {
    const [method, setMethod] = useState(data.method || "GET");
    const [url, setUrl] = useState(data.url || "");
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [params, setParams] = useState(data.params || {});
    const [body, setBody] = useState(data.body || "");
    const [contentType, setContentType] = useState(data.contentType || "None");
    const [response, setResponse] = useState(data.response || null);
    const [error, setError] = useState(null);
    const [responseTime, setResponseTime] = useState(null);

    const lastPushedRef = useRef(null);

    useEffect(() => {
        setUrl(data.url || "");
        setMethod(data.method || "GET");
        setParams(data.params || {});
        setBody(data.body || "");
        setContentType(data.contentType || "None");
        setResponse(data.response || null);
    }, [data]);

    const buildPayload = () => ({
        url,
        method,
        params,
        contentType,
        body,
        response,
    });

    const isSamePayload = (a, b) => {
        try {
            return JSON.stringify(a) === JSON.stringify(b);
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (typeof onChangeData !== "function") return;
        const payload = buildPayload();
        if (
            !isSamePayload(payload, lastPushedRef.current) &&
            !isSamePayload(payload, data)
        ) {
            lastPushedRef.current = payload;
            onChangeData({
                ...data,
                ...payload,
            });
        }
    }, [
        url,
        method,
        JSON.stringify(params),
        body,
        contentType,
        JSON.stringify(response),
        onChangeData,
    ]);

    let handleReq = async (e) => {
        e.preventDefault();

        setError(null);
        setResponse(null);
        setResponseTime(null);

        const start = performance.now();

        try {
            const config = {
                method,
                url,
                headers: {},
            };

            if (Object.keys(params || {}).length) config.params = params;

            if (method !== "GET" && body) {
                config.data = body;
                if (contentType !== "None") {
                    config.headers["Content-Type"] = contentType;
                }
            }

            const res = await axios.request(config);

            const end = performance.now();

            setResponseTime(end - start);

            const resPayload = {
                status: res.status,
                data: res.data,
                headers: res.headers,
            };

            setResponse(resPayload);
        } catch (err) {
            const end = performance.now();
            setResponseTime(end - start);

            const payload = {
                message: err.message,
                response: err.response
                    ? { status: err.response.status, data: err.response.data }
                    : null,
            };

            setError(payload);
            setResponse({ error: payload });
        }
    };

    let handleAddParam = () => {
        if (!key) return;
        setParams((prev) => {
            const updated = { ...(prev || {}), [key]: value };
            return updated;
        });
        setKey("");
        setValue("");
    };

    let handleDelParam = (k) => {
        setParams((prev) => {
            const updated = { ...(prev || {}) };
            delete updated[k];
            return updated;
        });
    };

    let clearResponse = () => {
        setResponse(null);
        setError(null);
    };

    return (
        <div id="input-container" key={tabId}>
            <form onSubmit={handleReq}>
                <div id="f-1">
                    <Method method={method} setMethod={setMethod} />
                    <input
                        type="text"
                        placeholder="enter url"
                        id="url"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input"
                    />
                </div>
                <div id="f-2">
                    <h2>Params</h2>
                    <input
                        type="text"
                        name="key"
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="key"
                        className="input"
                    />
                    <input
                        type="text"
                        name="value"
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="value"
                        className="input"
                    />
                    <button
                        type="button"
                        onClick={handleAddParam}
                        id="params-btn"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <div className="params">
                        <table className="params-table">
                            <tbody>
                                {Object.entries(params || {}).map(([k, v]) => (
                                    <tr key={k}>
                                        <td>{k}</td>
                                        <td>{String(v)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelParam(k)
                                                }
                                                className="close-btn"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {Object.keys(params || {}).length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="no-params">
                                            No params
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="f-3">
                    <h2>Body</h2>
                    <select
                        name="contentType"
                        id="contentType"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                    >
                        <option value="None">None</option>
                        <option value="application/json">
                            application/json
                        </option>
                        <option value="text/plain">text/plain</option>
                        <option value="text/html">text/html</option>
                    </select>
                    <textarea
                        name="body"
                        id="body"
                        rows={5}
                        cols={20}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                </div>
                <button className="btn" type="submit">
                    Send
                </button>
            </form>
            <Response response={response} time={responseTime} error={error} />
        </div>
    );
}
