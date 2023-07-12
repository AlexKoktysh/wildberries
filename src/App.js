import { useState, useEffect } from "react";
import { TableComponent } from "./components/TableComponent";
import { Box } from "@mui/material";
import { getDate } from "./api";
import { InputComponent } from "./components/InputComponent";
import { ButtonComponent } from "./components/ButtonComponent";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const App = () => {
  const [open, setOpen] = useState(false);
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

  const [editFields, setEditFields] = useState({});

  const setEditRows = (label, id, value) => {
    if (label === "Артикул в Lillo")
      return setEditFields((prev) => ({
        ...prev,
        id,
        liloo_article: [...value],
      }));
    return setEditFields((prev) => ({
      ...prev,
      id,
      seller: [...value],
    }));
  };

  const submitServer = () => {
    console.log(JSON.parse(sessionStorage.getItem("editFields")));
    sessionStorage.clear();
  };
  const changeFocusInput = (id) => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    if (items?.id && items.id !== id) {
      setOpen(true);
    }
  };
  const cancel = () => {
    sessionStorage.clear();
    setOpen(false);
  };
  const save = () => {
    submitServer();
    setOpen(false);
  };
  const checkDisabled = (id) => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    return !(items?.id && items.id === id);
  };
  const changeRows = (rows) => {
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.id)} submitServer={submitServer} />
    }));
    setRows(custom_rows);
  };

  useEffect(() => {
    sessionStorage.setItem("editFields", JSON.stringify(editFields));
    changeRows(rows);
  }, [editFields, rows]);

  const fetchDate = async (params) => {
    setLoading(true);
    const { columns, rows, totalRecords, sellerDictionary, lilooArticleDictionary } = await getDate(params);
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.id)} submitServer={submitServer} />
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
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>
          Вы хотите сохранить введенные данные?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            В случае отказа все внесенные изминения пропадут.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()}>Нет</Button>
          <Button onClick={() => save()}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};