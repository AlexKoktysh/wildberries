import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { PaginationComponent } from "./PaginationComponent";

export const TableComponent = (props) => {
    const {
        totalRecords,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        loading,
        columns,
        rows,
        sellerDictionary,
        lilooArticleDictionary,
    } = props;

    return (
        <MaterialReactTable
            columns={columns}
            data={rows}
            initialState={{ density: 'compact' }}
            state={{
                pagination,
                sorting,
                columnFilters,
                globalFilter,
                showSkeletons: loading,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            rowCount={totalRecords}
            localization={MRT_Localization_RU}
            defaultColumn={{
                minSize: 40,
                maxSize: 300,
                size: 250,
            }}
            muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
                width: "100%",
                className: "pagination",
                ActionsComponent: () => PaginationComponent({ setPagination, pagination, totalRecords })
            }}
        />
    );
};