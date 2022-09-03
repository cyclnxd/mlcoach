import { Paper, Stack, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { memo, useCallback, useEffect, useState } from 'react'
import { Handle, Position, updateEdge } from 'react-flow-renderer'

import store from '../../../store/store.ts'
import useStore ,{onStore} from 'zustand'


const initialInputs = new Object({
	Input: 12,
})

function VariableInput(){
    const [inputs, setInputs] = useState(initialInputs)
    const handleChange = event => {
            store.getState().onStore(event.target.value)
    }

    return(
		<>
        		<Paper
				elevation={24}
				sx={{
					width: 200,
					height: 75,
					backgroundColor: '#ffff',
					padding: '18px',
				}}>		
                <TextField
                value={inputs.a}
                name='a'
                onChange={handleChange}
                sx={{
                    '& label': {
                        color: '#2051ab',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#2051ab',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#2051ab',
                        },
                        '&:hover fieldset': {
                            borderColor: '#2051ab',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#2051ab',
                        },
                    },
                }}
                size='small'
                className='nodrag'
                hiddenLabel
                label='First Number'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            	<Handle
					type='source'
					position={Position.Right}
					style={{
						top: '90%',
						width: '15px',
						height: '15px',
						backgroundColor: '#a85d0d',
					}}
					isConnectable={true}
				/>
                </Paper>
        </>)
}
export default memo(VariableInput)