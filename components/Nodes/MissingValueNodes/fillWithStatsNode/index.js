import React, { useState, useEffect, memo, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import store from "../../../../store/store.ts";
import { Handle } from "react-flow-renderer";
import {
  Card,
  Stack,
  Typography,
  Autocomplete,
  Button,
  Pagination,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import HeaderLayout from "../../HeaderLayout";

function FillWithStatsNode({ id, selected, data }) {
  const [columns, setColumns] = useState(() => []);
  const [selectedColumn, setSelectedColumn] = useState(() => []);
  const prevSelectedColumn = useRef(selectedColumn);

  const [error, setError] = useState("connect a data source to select columns");

  const keys = ["Minumum", "Maximum", "Mean", "Median"];
  const [selectedKey, setSelectedKey] = useState("Mean");

  const [startImputation, setStartImputation] = useState("true");

  const [fileChanged, setFileChanged] = useState(false);

  const handleButtonClick = (event) => {
    let value = startImputation !== "true" ? "true" : "false";
    setStartImputation(value);
  };

  const handleKeyChange = (event, value) => {
    setSelectedKey(value);
  };

  const handleColumnChange = (event, value) => {
    prevSelectedColumn.current = value;
    setSelectedColumn(prevSelectedColumn.current);
  };
  useEffect(() => {
    // checking if the user has created a valid edge between two nodes
    const edge = Object.values(store.getState().edges).find(
      (item) => item.target === id
    );
    const sourceId = edge !== undefined ? edge.source : undefined;
    if (sourceId !== undefined) {
      let file =
        store.getState().fileMap[id] === undefined
          ? structuredClone(store.getState().fileMap[sourceId])
          : structuredClone(store.getState().fileMap[id]);
      if (file !== undefined && file?.data.length > 0) {
        setError("");
        file = {
          ...file,
          data: file.data,
        };
        var set = new Set();
        for (const column of Object.keys(file.data[0])) {
          for (var index in file.data) {
            if (!file.data[index][column]) {
              set.add(column);
            }
          }
        }
        setColumns([...set]);
        setSelectedColumn(prevSelectedColumn.current);
        let mean = [];
        let minumum = [];
        let maximum = [];
        let median = [];
        let sum = 0;
        switch (selectedKey) {
          case "Median": {
            if (selectedColumn.length !== 0) {
              for (const column of selectedColumn) {
                var array = []
                for(var index in file.data){
                  if(file.data[index][column]){
                    array.push(file.data[index][column])
                  }
                }
                 
                array = quickSort(array);
                median[column] = array[Math.floor(array.length / 2)];
                for(var index in file.data){
                  if(!file.data[index][column]){
                    file.data[index][column] = median[column]
                  }
                }
              }
            }
          }
          case "Mean": {
            if (selectedColumn.length !== 0) {
              for (const column of selectedColumn) {
                for (var index in file.data) {
                  if (file.data[index][column]) {
                    sum += parseInt(file.data[index][column]);
                  }
                }
                mean[column] = sum / file.data.length;
                for (var index in file.data) {
                  if (!file.data[index][column]) {
                    file.data[index][column] = mean[column];
                  }
                }
              }
            }
          }
          case "Maximum": {
            if (selectedColumn.length !== 0) {
              let max = Number.MIN_VALUE;
              for (const column of selectedColumn) {
                max = Number.MIN_VALUE;
                for (var index in file.data) {
                  if (parseInt(file.data[index][column]) > max) {
                    max = parseInt(file.data[index][column]);
                  }
                }
                maximum[column] = max;
                for (var index in file.data) {
                  if (!file.data[index][column]) {
                    file.data[index][column] = maximum[column];
                  }
                }
              }
            }
          }
          case "Minumum": {
            let min = Number.MAX_VALUE;
            if (selectedColumn.length !== 0) {
              for (const column of selectedColumn) {
                min = Number.MAX_VALUE;
                for (var index in file.data) {
                  if (parseInt(file.data[index][column]) < min) {
                    min = parseInt(file.data[index][column]);
                  }
                }
                minumum[column] = min;
                for (var index in file.data) {
                  if (!file.data[index][column]) {
                    file.data[index][column] = minumum[column];
                  }
                }
              }
            }
          }
        }

        startImputation === "true"
          ? store.getState().storeFile(id, file)
          : startImputation === "true"
          ? setFileChanged(true)
          : setFileChanged(false);
        setStartImputation("false");
      } else {
        setError("data source has no data");
      }
    } else {
      setError("connect a data source to slice data");
    }
  }, [id, data, selectedColumn, selectedKey, startImputation, fileChanged]);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <meta name="viewport" content="width=device-width"></meta>
      <Box
        sx={{
          height: "15px",
          width: 15,
          backgroundColor: "primary.light",
          borderRadius: "15px 0px 0px 15px",
        }}
      >
        <Handle
          type="target"
          position="left"
          id={`StaticFill-in`}
          key={`${id}-in`}
          style={{
            left: "0%",
            width: "15px",
            top: "50%",
            height: "15px",
            background: "none",
            border: "none",
            borderRadius: "15px 0px 0px 15px",
          }}
          isConnectable={true}
        />
      </Box>
      <Card
        sx={{
          backgroundColor: "primary.surface",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
        style={
          selected
            ? { border: "0.5px solid #403f69" }
            : { border: "0.5px solid #333154" }
        }
      >
        <Stack spacing={1}>
          <HeaderLayout title="Statistic Filling" id={id} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              gap: "15px",
              width: "190px",
              ".MuiOutlinedInput-root": {
                color: "primary.contrastText",
                fontSize: "12px",
              },
              "& label": {
                color: "primary.contrastText",
                fontSize: "12px",
              },
              "& label.Mui-focused": {
                color: "primary.contrastText",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "green",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "primary.darkLight",
                },
                "&:hover fieldset": {
                  borderColor: "primary.light",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.light",
                },
              },
            }}
          >
            {error.length === 0 ? (
              <>
                <Typography
                  fontSize={11}
                  sx={{ color: "primary.contrastText" }}
                >
                  Fill data with selected mode
                </Typography>

                <Autocomplete
                  multiple
                  id="tags-columns"
                  options={columns}
                  disableCloseOnSelect
                  getOptionLabel={(columns) => columns}
                  onChange={(event, value) => handleColumnChange(event, value)}
                  renderOption={(props, columns, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {columns}
                    </li>
                  )}
                  style={{ width: "170px", color: "primary.light" }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ color: "primary.light" }}
                      {...params}
                      label="Column Box"
                      placeholder="Columns"
                    />
                  )}
                />

                <Autocomplete
                  id="tags-statistic"
                  options={keys}
                  getOptionLabel={(keys) => keys}
                  onChange={(event, value) => handleKeyChange(event, value)}
                  style={{ width: "170px", color: "primary.light" }}
                  renderOption={(props, columns, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {columns}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      sx={{ color: "primary.light" }}
                      {...params}
                      label="Variables Box"
                      placeholder="Columns"
                    />
                  )}
                />
                <Button
                  variant="contained"
                  value={startImputation}
                  onClick={() => handleButtonClick(event)}
                  sx={{
                    color: "primary.contrastText",
                    overflow: "hidden",
                    fontWeight: "300",
                    fontSize: "10px",
                    borderRadius: "0px!important",
                    backgroundColor: "primary.light",
                    "&.Mui-selected": {
                      color: "primary.darkText",
                      borderColor: "primary.light !important",
                    },
                  }}
                >
                  Imput Selected Columns
                </Button>
                <Pagination count={2} variant="outlined" shape="rounded" />
              </>
            ) : (
              <Typography>{error}</Typography>
            )}
          </Box>
        </Stack>
      </Card>
      <Box
        sx={{
          height: "15px",
          width: 15,
          backgroundColor: "primary.light",
          borderRadius: "0px 15px 15px 0px",
        }}
      >
        <Handle
          type="source"
          position="right"
          id={`StaticFill-out`}
          key={`${id}-out`}
          style={{
            left: "91%",
            width: "15px",
            top: "50%",
            height: "15px",
            background: "none",
            border: "none",
            borderRadius: "0px 15px 15px 0px",
          }}
          isConnectable={true}
        />
      </Box>
    </Grid>
  );
}

function quickSort(origArray) {
  if (origArray.length <= 1) {
    return origArray;
  } else {
    var left = [];
    var right = [];
    var newArray = [];
    var pivot = origArray.pop();
    var length = origArray.length;
    for (var i = 0; i < length; i++) {
      if (origArray[i] <= pivot) {
        left.push(origArray[i]);
      } else {
        right.push(origArray[i]);
      }
    }
    return newArray.concat(quickSort(left), pivot, quickSort(right));
  }
}

export default memo(FillWithStatsNode);
