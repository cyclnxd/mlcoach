import React, { useState, useEffect, memo, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import store from 'lib/store/store.ts'
import {
	Card,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import HeaderLayout from '../HeaderLayout'
import CustomHandle from '../CustomHandle'
import localforage from "localforage";
import { useTranslations } from 'next-intl'

function DropColumnNode({ id, selected, data }) {
	const dc = useTranslations('editor.nodes.dropColumn')
	const e = useTranslations('editor.nodes.errors')
  // store the columns of DataFrame
  const [keys, setKeys] = useState([]);
  // store the selected unique columns
  const [selectedColumns, setSelectedColumns] = useState(() => []);
  const selectedColRef = useRef(selectedColumns);
  const [error, setError] = useState("connect a data source to select columns");
  // takes the selected columns and adds it to end of the Set structure
  const handleSelected = (_, columns) => {
    selectedColRef.current = columns;
    setSelectedColumns(columns);
  };
useEffect(() => {
  async function deleteFile() {
    await localforage.removeItem(id);
  }
  const edge = Object.values(store.getState().edges).find(
    (item) => item.target === id
  );
  const sourceId = edge !== undefined ? edge.source : undefined;
  if (sourceId !== undefined) {
    localforage.getItem(sourceId).then((file) => {
      if (file !== undefined && file?.data.length > 0) {
        setError("");
        // store the all column to the keys state
        setKeys(Object.keys(file.data[0]));
		console.log(keys)
        // deletes the selected columns from the file
        for (var row in file.data) {
          for (const column of selectedColumns) {
            delete file.data[row][column];
          }
        }
        for (var field in file.meta.fields) {
          for (const column of selectedColumns) {
            if (file.meta.fields[field] === column) {
              delete file.meta.fields[field];
            }
          }
        }
        localforage.setItem(id, file);
      } else {
        deleteFile();
        setKeys([]);
        setError(e('noData'))
      }
    });
  } else {
    deleteFile();
    setKeys([])
    setError(e('noData'))
  }
}, [id, selected, data, selectedColumns]);

	

	return (
		<Grid container direction='row' justifyContent='center' alignItems='center'>
			<CustomHandle
				type='target'
				position='left'
				id={`drop-in`}
				key={`drop-${id}-in`}
				isConnectable={true}
			/>
			<Card
				sx={{
					backgroundColor: 'primary.surface',
					color: 'white',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				style={
					selected
						? { border: '0.5px solid #403f69' }
						: { border: '0.5px solid #333154' }
				}>
				<Stack spacing={1}>
					<HeaderLayout title={dc('name')} id={id} />
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '10px',
							gap: '10px',
							width: '200px',
							'.MuiOutlinedInput-root': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label': {
								color: 'primary.contrastText',
								fontSize: '12px',
							},
							'& label.Mui-focused': {
								color: 'primary.contrastText',
							},
							'& .MuiInput-underline:after': {
								borderBottomColor: 'green',
							},
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: 'primary.darkLight',
								},
								'&:hover fieldset': {
									borderColor: 'primary.light',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.light',
								},
							},
						}}>
						{error === "" ? (
							<>
								<Typography
									fontSize={11}
									sx={{ color: 'primary.contrastText' }}>
									{dc('content')}
								</Typography>
								<ToggleButtonGroup
									className='nodrag'
									value={selectedColumns}
									onChange={handleSelected}
									aria-label='data columns'
									color='success'
									sx={{
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gap: '6px',
										width: '100%',
									}}>
									{keys.map((item, index) => (
										<ToggleButton
											size='small'
											key={index}
											value={item}
											aria-label={item}
											sx={{
												color: 'primary.contrastText',
												overflow: 'hidden',
												fontWeight: '300',
												fontSize: '8px',
												borderRadius: '0px!important',
												backgroundColor: 'primary.light',
												'&.Mui-selected': {
													color: 'primary.darkText',
													borderColor: 'primary.light !important',
												},
											}}>
											{item}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</>
						) : (
							<Typography>{error}</Typography>
						)}
					</Box>
				</Stack>
			</Card>
			<CustomHandle
				type='source'
				position='right'
				id={`drop-out`}
				key={`drop-${id}-out`}
				isConnectable={true}
				onConnect={params => handleConnect(params)}
			/>
		</Grid>
	)
}

export default memo(DropColumnNode);
