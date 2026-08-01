import InputAdornment from '@mui/material/InputAdornment'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { Search } from 'lucide-react'

const SearchBar = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            sx={{
                flexShrink: 0
            }}
            size='small'
            slotProps={{
                input: {
                    startAdornment: <InputAdornment position="start"><Search size={16}/></InputAdornment>,
                },
            }}
    />
  )
}

export default SearchBar
