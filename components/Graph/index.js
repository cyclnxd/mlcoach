import { Box, Typography, Stack } from "@mui/material";
import { useState, useEffect, useRef, memo } from "react";

import store from "lib/store/store.ts";
import StormIcon from "@mui/icons-material/Storm";
import { Chart } from "react-google-charts";
import PlotGraph from "./PlotGraph";

function Graph({ onDelete, isDisplay }) {
  const [view, setView] = useState();
  const z = -20;
  const x = 0;
  let chartParams = { title: "deneme", subtitle: "deneme" };
  let axisParams = {
    xAxis: { title: "MPG", minValue: 0, maxValue: 500 },
    yAxis: { title: "Horsepower", minValue: 0, maxValue: 500 },
  };
  const ref = useRef({
    x,
    z,
  });
  //store da seçilen node tutmak için
  const [selectedNode, setSelectedNode] = useState();
  const [fileMap, setFileMap] = useState();

  // sayfayı yeniden render almadan store içerisinde ki verileri subscribe ile çekip komponentin içerisine usestate veya benzeri hook ile kaydedersek useef rahatlıkla çalışıyor o yüzden bu var :D
  store.subscribe(() => {
    setSelectedNode(store.getState().clickedNode);
    setFileMap(
      store.getState().fileMap[store.getState().clickedNode]
        ? store.getState().fileMap[store.getState().clickedNode]
        : undefined
    );
  });
  useEffect(() => {
    //satır ve sutünlar okunuyor
    if (fileMap !== undefined && fileMap !== null) {

    } else {
      //eğer dosya map undefined ise önceki satır ve sutünları
      console.log();
    }
  }, [fileMap, selectedNode]);

  function render() {}

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        height: "100%",
        width: "100%",
        border: "1px solid",
        borderColor: "primary.light",
        display: isDisplay ? "block" : "none",
      }}
    >
      <Stack
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid",
            borderColor: "primary.light",
            fontWeight: "bold",
            letterSpacing: 1.5,
            color: "primary.contrastText",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            fontSize={13}
            component="div"
            color="inherit"
            sx={{
              m: 1,
            }}
          >
            Graph
          </Typography>
          <StormIcon
            onClick={onDelete}
            fontSize="inherit"
            color="inherit"
            sx={{
              m: 1,
              cursor: "pointer",
              opacity: 0.5,
              "&:hover": {
                color: "primary.darkText",
                opacity: 1,
              },
            }}
          />
        </Box>
        {store.getState().clickedNode !== -1 ? (
          <div>
            <PlotGraph
              data={fileMap}
              width={"100%"}
              height={"100%"}
              chartParams={chartParams}
			  axisParams={axisParams}
			  update={selectedNode}
            />
          </div>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
}

export default memo(Graph);
