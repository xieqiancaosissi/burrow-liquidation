import React, { useEffect, useState } from "react";
import { getHistoryData } from "@/services/api";
import ReactPaginate from "react-paginate";
import { BeatLoading } from "./Loading";
import { formatTimestamp } from "@/utils/time";

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [sizeCount, setSizeCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    get_history_data(currentPage + 1);
  }, [currentPage]);

  async function get_history_data(page: number | undefined) {
    setLoading(true);
    const res = await getHistoryData(page);
    if (res && res.data) {
      setHistoryData(res.data.record_list);
      setPageCount(res.data.total_page);
      setSizeCount(res.data.total_size);
      setLoading(false);
    }
  }

  const handlePageClick = (data: {
    selected: React.SetStateAction<number>;
  }) => {
    setCurrentPage(data.selected);
  };

  // console.log(historyData, "historyData");

  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "90vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Record List(Total: {sizeCount})
      </div>
      <div className="overflow-auto w-full" style={{ maxHeight: "84vh" }}>
        <table className="commonTable">
          <thead>
            <tr>
              <th>accountId</th>
              <th>receiptId</th>
              {/* <th>healthFactorAfter</th> */}
              <th>isRead</th>
              <th>isDeleted</th>
              <th>position</th>
              <th>liquidationType</th>
              {/* <th>healthFactorBefore</th> */}
              <th>RepaidAssets</th>
              <th>LiquidatedAssets</th>
              <th>createdAt</th>
              <th>updatedAt</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((l, index) => {
              // console.log(l.isRead);
              return (
                <tr
                  key={index}
                  className="hover:bg-dark-250 border-b border-dark-100"
                >
                  <td title={l.account_id}>
                    <div
                      className="justify-self-start overflow-hidden w-56 py-6"
                      style={{ wordWrap: "break-word" }}
                    >
                      {l.account_id}
                    </div>
                  </td>
                  <td title={l.receipt_id}>
                    {" "}
                    <div
                      className="justify-self-start overflow-hidden w-56 py-6"
                      style={{ wordWrap: "break-word" }}
                    >
                      {l.receipt_id}
                    </div>
                  </td>
                  {/* <td>{l.healthFactor_after}</td> */}

                  <td>{l.isRead ? "true" : "false"}</td>
                  <td>{l.isDeleted ? "true" : "false"}</td>
                  <td>{l.position}</td>
                  <td>{l.liquidation_type}</td>
                  <td>
                    {l.RepaidAssets.map((asset: any, assetIndex: any) => (
                      <div key={assetIndex}>
                        <span>
                          {asset.token_id}
                          <br />
                          {asset.amount}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td>
                    {" "}
                    {l.LiquidatedAssets.map((asset: any, assetIndex: any) => (
                      <div key={assetIndex}>
                        <span>
                          {asset.token_id}
                          <br />
                          {asset.amount}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td>{formatTimestamp(l.createdAt)}</td>
                  <td>{formatTimestamp(l.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading ? <BeatLoading /> : null}
        {!loading && !historyData.length ? (
          <div className="flex items-center justify-center text-base text-dark-300 my-20">
            fetch data error...
          </div>
        ) : null}
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active-page"}
      />
    </div>
  );
}
