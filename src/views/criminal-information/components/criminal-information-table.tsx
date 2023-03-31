import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import {
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
} from "react";
import {
  deleteInformation,
  getInformationList,
  getNewInformationList,
  Order,
  QueryOption,
} from "@/services/criminal-information";
import moment from "moment";
import {
  Drawer,
  FormControlLabel,
  InputAdornment,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ViewInformationModal } from "./information-detail-modal";
import {
  Information,
  InvestigationBodyInformation,
  ProcuracyInformation,
} from "@/models/information";
import { Add, CheckBox, Search } from "@mui/icons-material";
import { useAppToast } from "@/hook/toast";
// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

type FilterOption = "all" | "new";

function OrderMapper(order: Order): "desc" | "asc" {
  switch (order) {
    case Order.ASC:
      return "asc";
    case Order.DESC:
      return "desc";
    default:
      return "asc";
  }
}

// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key
// ): (
//   a: { [key in Key]: number | string },
//   b: { [key in Key]: number | string }
// ) => number {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// // with exampleArray.slice().sort(exampleComparator)
// function stableSort<T>(
//   array: readonly T[],
//   comparator: (a: T, b: T) => number
// ) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

interface HeadCell {
  disablePadding: boolean;
  id:
    | keyof Information
    | keyof ProcuracyInformation
    | keyof InvestigationBodyInformation;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "acceptanceNo",
    numeric: false,
    disablePadding: true,
    label: "Số thụ lý",
  },
  {
    id: "acceptedAt",
    numeric: false,
    disablePadding: false,
    label: "Ngày thụ lý",
  },
  {
    id: "plaintiff",
    numeric: false,
    disablePadding: false,
    label: "Nguyên đơn",
  },
  {
    id: "defendant",
    numeric: false,
    disablePadding: false,
    label: "Bị đơn",
  },
  {
    id: "investigator",
    numeric: false,
    disablePadding: false,
    label: "Điều tra viên",
  },
  {
    id: "procurator",
    numeric: false,
    disablePadding: false,
    label: "KSV thụ lý",
  },
];

const DEFAULT_ORDER = Order.ASC;
const DEFAULT_ORDER_BY = "acceptanceNo";
const DEFAULT_ROWS_PER_PAGE = 25;

interface CrTableProps {
  numSelected: number;
  // onRequestSort: (event: MouseEvent<unknown>, newOrderBy: keyof Data) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function CrTableHead(props: CrTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    // onRequestSort,
  } = props;
  // const createSortHandler =
  //   (newOrderBy: keyof Data) => (event: MouseEvent<unknown>) => {
  //     onRequestSort(event, newOrderBy);
  //   };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? OrderMapper(order) : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? OrderMapper(order) : "asc"}
              // onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === Order.DESC
                    ? "sorted descending"
                    : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">Hành động</TableCell>
      </TableRow>
    </TableHead>
  );
}

type FilterType = "all" | "new";

interface TableToolbarProps {
  numSelected: number;
  onAddingClick: () => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (value: FilterType) => void;
  filter: FilterType;
  onDeleteClick: () => void;
}

function TableToolbar(props: TableToolbarProps) {
  const {
    numSelected,
    onAddingClick,
    onSearchChange,
    onFilterChange,
    filter,
    onDeleteClick,
  } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleFilterOptionClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterOptionClose = () => {
    setAnchorEl(null);
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Đã chọn {numSelected} tin báo
        </Typography>
      ) : (
        <Stack
          gap={5}
          width={"100%"}
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Tooltip title="Filter list">
            <IconButton onClick={onAddingClick}>
              <Add />
            </IconButton>
          </Tooltip>

          <Box width={"60%"}>
            <TextField
              fullWidth
              id="search-information-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              onChange={(event) => {
                const term = (event.target as HTMLInputElement).value;
                onSearchChange && onSearchChange(term);
              }}
            />
          </Box>

          <Tooltip title="Filter list">
            <IconButton onClick={handleFilterOptionClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            open={open}
            onClose={handleFilterOptionClose}
            anchorEl={anchorEl}
          >
            <Typography ml={2}>Lọc</Typography>
            <RadioGroup
              value={filter ?? "all"}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement)
                  .value as FilterType;
                onFilterChange && onFilterChange(value);
              }}
            >
              <MenuItem>
                <FormControlLabel
                  value="all"
                  control={<Radio size="small" />}
                  label="Tất cả"
                />
              </MenuItem>
              <MenuItem>
                <FormControlLabel
                  value="new"
                  control={<Radio size="small" />}
                  label="Tin báo mới"
                />
              </MenuItem>
            </RadioGroup>
          </Menu>
        </Stack>
      )}
      {numSelected > 0 && (
        <Stack direction="row" spacing={2}>
          <Tooltip title="Xóa">
            <IconButton onClick={onDeleteClick} aria-label="delete">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </Toolbar>
  );
}

export default function CriminalInformationTable() {
  const [order, setOrder] = useState<Order>(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState<keyof Information>(DEFAULT_ORDER_BY);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState<Information[] | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [detailSelected, setDetailSelected] = useState<string | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const { showSuccessToast, showFailToast } = useAppToast();

  useEffect(() => {
    // let rowsOnMount = stableSort(
    //   rows,
    //   getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    // );
    // rowsOnMount = rowsOnMount.slice(
    // let rowsOnMount = rows.slice(
    //   0 * DEFAULT_ROWS_PER_PAGE,
    //   0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    // );

    getListInformation({
      offset: page,
      limit: rowsPerPage,
      order: Order.ASC,
      search: searchTerm ? searchTerm : null,
    });
  }, [searchTerm, filter]);

  // const handleRequestSort = useCallback(
  //   (event: MouseEvent<unknown>, newOrderBy: keyof Data) => {
  //     const isAsc = orderBy === newOrderBy && order === "asc";
  //     const toggledOrder = isAsc ? "desc" : "asc";
  //     setOrder(toggledOrder);
  //     setOrderBy(newOrderBy);

  //     // const sortedRows = stableSort(
  //     //   rows,
  //     //   getComparator(toggledOrder, newOrderBy)
  //     // );
  //     const updatedRows = rows.slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     );
  //     setVisibleRows(updatedRows);
  //   },
  //   [order, orderBy, page, rowsPerPage]
  // );

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && visibleRows) {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);

      // const sortedRows = stableSort(rows, getComparator(order, orderBy));
      // const updatedRows = rows.slice(
      //   newPage * rowsPerPage,
      //   newPage * rowsPerPage + rowsPerPage
      // );
      getListInformation({
        offset: newPage * rowsPerPage,
        limit: rowsPerPage,
        order: Order.ASC,
        search: searchTerm ? searchTerm : null,
      });
    },
    [order, orderBy, rowsPerPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      // const sortedRows = stableSort(rows, getComparator(order, orderBy));
      // const updatedRows = rows.slice(
      //   0 * updatedRowsPerPage,
      //   0 * updatedRowsPerPage + updatedRowsPerPage
      // );
      getListInformation({
        offset: 0 * updatedRowsPerPage,
        limit: updatedRowsPerPage,
        order: Order.ASC,
        search: searchTerm ? searchTerm : null,
      });

      // setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy]
  );

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const getListInformation = (queryOpt: QueryOption) => {
    // let getListService = getInformationList;
    switch (filter) {
      case "all": {
        getInformationList(queryOpt).then((data) => {
          setVisibleRows(data[0]);
          setTotalItem(data[1]);
        });
        break;
      }
      case "new": {
        getNewInformationList(queryOpt).then((data) => {
          setVisibleRows(data[0]);
          setTotalItem(data[1]);
        });
        break;
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar
          onDeleteClick={() => {
            deleteInformation(selected)
              .then(() => {
                showSuccessToast(`Xóa thành công`);
                setSelected([]);
                getListInformation({
                  offset: page,
                  limit: rowsPerPage,
                  order: Order.ASC,
                  search: searchTerm ? searchTerm : null,
                });
              })
              .catch(() => {
                showFailToast("Xóa thất bại");
              });
          }}
          onAddingClick={() => {
            setIsOpenDetail(true);
          }}
          numSelected={selected.length}
          onSearchChange={(term) => {
            setSearchTerm(term);
          }}
          filter={filter}
          onFilterChange={setFilter}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <CrTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              // onRequestSort={handleRequestSort}
              rowCount={visibleRows ? visibleRows.length : 0}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.acceptanceNo}
                        </TableCell>
                        <TableCell>
                          {moment(row.acceptedAt.toISOString()).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell>{row.plaintiff}</TableCell>
                        <TableCell>{row.defendant}</TableCell>
                        <TableCell>
                          {row.investigationInformation?.investigator}
                        </TableCell>
                        <TableCell>
                          {row.procuracyInformation?.procurator}
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation();
                                setDetailSelected(row.id);
                              }}
                              aria-label="edit"
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 75, 100]}
          labelRowsPerPage="Số tin mỗi trang"
          component="div"
          count={totalItem}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`;
          }}
        />
      </Paper>
      <Drawer
        anchor={"right"}
        open={detailSelected !== null || isOpenDetail}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 101,
        }}
        onClose={() => {
          setDetailSelected(null);
          setIsOpenDetail(false);
        }}
      >
        <ViewInformationModal
          refresh={() => {
            setDetailSelected(null);
            setIsOpenDetail(false);

            getListInformation({
              offset: page,
              limit: rowsPerPage,
              order: Order.ASC,
              search: searchTerm ? searchTerm : null,
            });
          }}
          onClose={() => {
            setDetailSelected(null);
            setIsOpenDetail(false);
          }}
          information={visibleRows?.find((row) => row.id === detailSelected)}
        />
      </Drawer>
    </Box>
  );
}
