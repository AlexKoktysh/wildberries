import { useState, useEffect } from "react";
import { TableComponent } from "./components/TableComponent";
import { Box } from "@mui/material";
import { getDate } from "./api";
import { InputComponent } from "./components/InputComponent";
import { Button } from "@mui/material";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [sellerDictionary, setSellerDictionary] = useState([]);
  const [lilooArticleDictionary, setLilooArticleDictionary] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    page: 1,
    pageSize: 10,
    pageCount: Math.ceil(totalRecords / 10) || 0,
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const submit = () => {
    console.log("submit");
  };

  const fetchDate = async (params) => {
    setLoading(true);
    const { columns, rows, totalRecords, sellerDictionary, lilooArticleDictionary } = await getDate(params);
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} />,
      "edit": <Button variant='contained' onClick={submit}>Редактировать</Button>
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setSellerDictionary(sellerDictionary);
    setLilooArticleDictionary(lilooArticleDictionary);
    setLoading(false);
  };

  useEffect(() => {
    fetchDate({
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      searchText: globalFilter,
    });
  }, [
    pagination.pageSize,
    pagination.page,
    sorting,
    columnFilters,
    globalFilter,
  ]);

  return (
    <Box style={{ height: 1000, width: '100%', overflowY: 'auto' }}>
      <TableComponent
        totalRecords={totalRecords}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        loading={loading}
        columns={columns}
        rows={rows}
        sellerDictionary={sellerDictionary}
        lilooArticleDictionary={lilooArticleDictionary}
      />
    </Box>
  );
};