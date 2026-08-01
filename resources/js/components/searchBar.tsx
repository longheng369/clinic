import InputAdornment from '@mui/material/InputAdornment'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { Search } from 'lucide-react'

const SearchBar = (props: TextFieldProps) => {
    return (
        <TextField
            {...props}
            slotProps={{
                input: {
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                },
            }}
    />
  )
}

export default SearchBar
