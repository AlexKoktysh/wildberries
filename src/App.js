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
import { TextFields } from "./components/TextFields";

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

  const [editFields, setEditFields] = useState([]);

  const setEditRows = (label, id, value) => {
    let find = {};
    setRows((prev) => {
      find = prev.find((el) => el.reserve_qty.props.id === id);
      return prev;
    });
    const findField = editFields.find((el) => el.id === id);
    if (label === "Артикул в Lillo") {
      if (findField) {
        const newValue = editFields.map((el) => {
          if (el.id === id) {
            return {
              ...el,
              liloo_article: [...value],
            };
          }
          return el;
        });
        return setEditFields(newValue);
      }
      return setEditFields((prev) => {
        return [
          ...prev,
          {
            id,
            liloo_article: [...value],
            seller: [],
            reserve_qty: Number(find?.reserve_qty?.props?.value),
          },
        ];
      });
    }
    if (label === "reserve_qty") {
      if (findField) {
        const newValue = editFields.map((el) => {
          if (el.id === id) {
            return {
              ...el,
              reserve_qty: Number(value),
            };
          }
          return el;
        });
        return setEditFields(newValue);
      }
      return setEditFields((prev) => {
        return [
          ...prev,
          {
            id,
            liloo_article: [],
            seller: [],
            reserve_qty: Number(value),
          },
        ];
      });
    }
    if (findField) {
      const newValue = editFields.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            seller: [...value],
          };
        }
        return el;
      });
      return setEditFields(newValue);
    }
    return setEditFields((prev) => {
      return [
        ...prev,
        {
          id,
          liloo_article: [],
          seller: [...value],
          reserve_qty: Number(find?.reserve_qty?.props?.value),
        },
      ];
    });
  };

  const editRow = (id) => {
    setOpen(true);
    sessionStorage.setItem("fieldId", id);
  };

  const submitServer = async (id) => {
    setLoading(true);
    let params = {};
    if (id) {
      const items = JSON.parse(sessionStorage.getItem("editFields"));
      const field = items.find((el) => el.id === Number(id));
      params = {
        field: [field],
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    } else {
      params = {
        field: JSON.parse(sessionStorage.getItem("editFields")),
        filters: columnFilters,
        sorting,
        take: pagination.pageSize,
        skip: pagination.pageSize * (pagination.page - 1),
        searchText: globalFilter,
      };
    }
    const data = await editFieldsServer(params);
    sessionStorage.removeItem("editFields");
    sessionStorage.removeItem("fieldId");
    setLoading(false);
    if (data.error) return setAllert(data.error["ajax-errors"]);
    const { columns, rows, totalRecords, sellerDictionary, lilooArticleDictionary } = data;
    const custom_rows = rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.edit} setEditRows={setEditRows} defaultValue={[item["liloo_article"]]} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.edit} setEditRows={setEditRows} defaultValue={[item["seller"]]} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.edit)} submitServer={() => editRow(item.edit)} />,
      "reserve_qty": <TextFields value={item.reserve_qty} onBlur={setEditRows} id={item.edit} />
    }));
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setSellerDictionary(sellerDictionary);
    setLilooArticleDictionary(lilooArticleDictionary);
  };
  const cancel = () => {
    const id = sessionStorage.getItem("fieldId")
    submitServer(id);
    setOpen(false);
  };
  const save = () => {
    submitServer();
    setOpen(false);
  };
  const checkDisabled = (id) => {
    const items = JSON.parse(sessionStorage.getItem("editFields"));
    const findItem = items.find((el) => el.id === id);
    return !(findItem);
  };
  const changeRows = (default_rows, clear) => {
    const custom_rows = default_rows?.map((item) => ({
      ...item,
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item["liloo_article"].props.id} setEditRows={setEditRows} defaultValue={[item["liloo_article"]]} clear={clear} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item["liloo_article"].props.id} setEditRows={setEditRows} defaultValue={[item["seller"]]} clear={clear} />,
      "edit": <ButtonComponent disabled={checkDisabled(item["liloo_article"].props.id)} submitServer={() => editRow(item["liloo_article"].props.id)} />,
      "reserve_qty": <TextFields value={item["reserve_qty"].props.value} onBlur={setEditRows} id={item["liloo_article"].props.id} clear={clear} />
    }));
    setRows(custom_rows);
  };

  useEffect(() => {
    sessionStorage.setItem("editFields", JSON.stringify([...editFields]));
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
      "liloo_article": <InputComponent label="Артикул в Lillo" options={lilooArticleDictionary} id={item.edit} setEditRows={setEditRows} defaultValue={[item["liloo_article"]]} />,
      "seller": <InputComponent label="Поставщик" options={sellerDictionary} id={item.edit} setEditRows={setEditRows} defaultValue={[item["seller"]]} />,
      "edit": <ButtonComponent disabled={checkDisabled(item.edit)} submitServer={() => editRow(item.edit)} />,
      "reserve_qty": <TextFields value={item.reserve_qty} onBlur={setEditRows} id={item.edit} />
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
      <ButtonComponent text="Сохранить все" disabled={!editFields.length} submitServer={submitServer} />
    </Box>
  );
};