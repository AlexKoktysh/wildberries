import { useState, useEffect } from "react";
import { TableComponent } from "./components/TableComponent";
import { Box } from "@mui/material";
import { getDate, editFieldsServer } from "./api";
import { InputComponent } from "./components/InputComponent";
import { ButtonComponent } from "./components/ButtonComponent";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from "@mui/material/Alert";

export const App = () => {
  const [allert, setAllert] = useState("");
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

  const submitServer = async () => {
    setLoading(true);
    const params = {
      ...JSON.parse(sessionStorage.getItem("editFields")),
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.pageSize * (pagination.page - 1),
      searchText: globalFilter,
    };
    console.log("params", params)
    const data = await editFieldsServer(JSON.parse(sessionStorage.getItem("editFields")));
    sessionStorage.clear();
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords, sellerDictionary, lilooArticleDictionary } = data;
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.edit} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["liloo_article"]]} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.edit} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["seller"]]} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.edit)} submitServer={submitServer} />
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setSellerDictionary(sellerDictionary);
    setLilooArticleDictionary(lilooArticleDictionary);
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
    changeRows(rows, true);
  };
  const save = () => {
    submitServer();
    setOpen(false);
  };
  const checkDisabled = (id) => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    return !(items?.id && items.id === id);
  };
  const changeRows = (rows, clear) => {
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item["liloo_article"].props.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["liloo_article"]]} clear={clear} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item["liloo_article"].props.id} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["seller"]]} clear={clear} />,
      "edit": <ButtonComponent disabled={checkDisabled(item["liloo_article"].props.id)} submitServer={submitServer} />
    }));
    setRows(custom_rows);
  };

  useEffect(() => {
    sessionStorage.setItem("editFields", JSON.stringify(editFields));
    changeRows(rows, false);
  }, [editFields]);

  const fetchDate = async (params) => {
    setLoading(true);
    const data = await getDate(params);
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords, sellerDictionary, lilooArticleDictionary } = data;
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.edit} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["liloo_article"]]} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.edit} setEditRows={setEditRows} changeFocusInput={changeFocusInput} defaultValue={[item["seller"]]} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.edit)} submitServer={submitServer} />
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setSellerDictionary(sellerDictionary);
    setLilooArticleDictionary(lilooArticleDictionary);
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

  if (allert) {
    return <Alert severity="error">{allert}</Alert>;
  }

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