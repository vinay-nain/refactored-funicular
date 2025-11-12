const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function Method({ method, setMethod }) {
    return (
        <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="method-select"
        >
            {METHODS.map((m) => (
                <option key={m} value={m}>
                    {m}
                </option>
            ))}
        </select>
    );
}
