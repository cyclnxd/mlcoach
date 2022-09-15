import React, { useState, useEffect, memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import store from "../../../store/store.ts";
import { Handle } from "react-flow-renderer";
import { Card, ListItem, Stack } from "@mui/material";
import HeaderLayout from "../HeaderLayout";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";

function DropColumnNode({ id, selected }) {
  const [sourceState, setSourceState] = useState(0);
  const [keys, setKeys] = useState([]);
  const [selectHolder, setSelectedHolder] = useState(new Set());
  const chips = [];
  const handleDelete = () => {
    store.getState().onNodesChange([{ id, type: "remove" }]);
  };
  const HandleOption = (event) => {
    setSelectedHolder((item) => item.add(event.target.value));
  };
  const handleChipDelete = (item) => () => {
    selectHolder.delete(item);
  };
  useEffect(() => {
    const edge = Object.values(store.getState().edges).find(
        item => item.target === id
    )
    const index = edge !== undefined ? edge.source : undefined

    // if the user has created a valid edge, then we update the fileMap
    if (index !== undefined) {
        const file = {
            data: structuredClone(store
                .getState()
                .fileMap[index].data),
            meta: structuredClone(store.getState().fileMap[index].meta),
        }
        setKeys(Object.keys(file.data[0]));
        for (var row in file.data) {
          for (const column of selectHolder) {
            delete file.data[row][column];
          }
        }
        store.getState().storeFile(id, file);
        store.getState().storeFile(id, file)
    }
    // store.getState().storeFile(id, fileData)
  }, [sourceState, selected, selectHolder]);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
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
          id={`drop-in`}
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
          <HeaderLayout title="Drop" onDelete={handleDelete} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              gap: "10px",
              width: "200px",
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
            {selectHolder.forEach((item) =>
              chips.push(
                <Chip
                  key={item}
                  label={item}
                  sx={{ backgroundColor: "primary.contrastText" }}
                  variant="outlined"
                  onDelete={handleChipDelete(item)}
                />
              )
            )}
            <FormControl fullWidth>
              <Box sm={3}>{chips}</Box>
              <select onChange={HandleOption}>
                {keys.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </FormControl>
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
          id={`drop-out`}
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

export default memo(DropColumnNode);
