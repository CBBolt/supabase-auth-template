import useFetchDBData from "../hooks/useFetchDBData";

export default function Home() {
  const { data, loading, error } = useFetchDBData({
    method: "SELECT",
    datasource: "testing",
    columns: "username, age, is_active",
    filters: [
      {
        column: "username",
        operator: "not:in",
        value: "(yellow_john)",
      },
    ],
  });

  return (
    <>
      Home Page
      {error && <span>{`An error occured: ${JSON.stringify(error)}`}</span>}
      {loading && <span>Loading...</span>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {data && (
          <>
            <h3>Data</h3>
            {data.map((d, index) => (
              <div key={index}>
                {Object.entries(d as Record<string, unknown>).map(
                  ([key, value]) => (
                    <span key={key}>
                      {key}: {String(value)} <br />
                    </span>
                  )
                )}
                <br />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
