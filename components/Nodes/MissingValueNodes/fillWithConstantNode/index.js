import { useState, useEffect, memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import store from "lib/store/store.ts";
import { Card, Stack, Typography, TextField } from "@mui/material";
import HeaderLayout from "../../HeaderLayout";
import CustomHandle from "components/Nodes/CustomHandle";
import localforage from "localforage";
import { useTranslations } from 'next-intl'
function FillingConstantNode({ id, selected, data }) {
  const [fillingValue, setFillingValue] = useState(0);

  const [error, setError] = useState("connect a data source to select columns");

  const startTextHandle = (event) => {
    event.target.value === NaN
      ? () => {
          setFillingValue(0);
        }
      : setFillingValue(parseInt(event.target.value));
  };
  useEffect(() => {
    async function deleteFile() {
      await localforage.removeItem(id);
    }
    // checking if the user has created a valid edge between two nodes
    const edge = Object.values(store.getState().edges).find(
      (item) => item.target === id
    );
    const sourceId = edge !== undefined ? edge.source : undefined;
	console.log(localforage.getItem(sourceId).then(value =>  value))
    if (sourceId !== undefined) {
      localforage.getItem(sourceId).then((file) => {
        if (file !== undefined && file?.data.length > 0) {
          setError("");
          file = {
            ...file,
            data: file.data,
          };
          for (var row in file.data) {
            for (const column of Object.keys(file.data[0])) {
              if (!file.data[row][column]) {
                file.data[row][column] = fillingValue;
              }
            }
          }
          localforage.setItem(id, file);
        } else {
          deleteFile();
          setError("data source has no data");
        }
      });
    } else {
      deleteFile();
      setError("connect a data source to slice data");
    }
	
  }, [fillingValue, id, selected, data]);
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <CustomHandle
        type="target"
        position="left"
        id={`fwcn-in`}
        key={`fwcn-${id}-in`}
        isConnectable={true}
      />
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
          <HeaderLayout title="Constant Fill" id={id} />
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
            {error.length === "" ? (
              <>
                <TextField
                  id="outlined-name"
                  label="Value to fill"
                  className="nodrag"
                  size="small"
                  type="number"
                  onChange={startTextHandle}
                />
              </>
            ) : (
              <Typography>{error}</Typography>
            )}
          </Box>
        </Stack>
      </Card>
      <CustomHandle
        type="source"
        position="right"
        id={`fwcn-out`}
        key={`fwcn-${id}-out`}
        isConnectable={true}
      />
    </Grid>
  );
}

export default memo(FillingConstantNode);
