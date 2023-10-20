// import { Box,Pagination } from "@mui/material";
// import { ThemeProvider, makeStyles } from '@mui/styles';
// import { useState } from "react";

// const useStyles = makeStyles({
//     ul: {
//         "& .MuiPaginationItem-root": {
//             color: "#ffa600"
//         }
//     }
// });
// const pageSize = 3


// export default function AddPagination(){
//     const classes = useStyles();
//     const [pagination , setPagination] = useState({
//         count : 0,
//         from: 0,
//         to : pageSize
//     });
//     const handleChange = (event, page) => {
//         const from = (page - 1) * pageSize;
//         const to = (page - 1) * pageSize + pageSize;
//         setPagination({...pagination,from:from , to:to});
//     };
    // return(
    //     <Box justifyContent='center' alignItems='center' display='flex' sx={{margin:'20px 0px'}}>
    //         <Pagination count={Math.ceil(pagination.count/pageSize)} onChange={handleChange} variant="outlined" classes={{ ul: classes.ul }} />
    //     </Box>
        
//     );
// }

import React, { useState } from "react";

export default function AddPagination(data, itemsPerPage) {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(data.length / itemsPerPage);

    function currentData() {
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return data.slice(begin, end);
    }

    function next() {
        setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage));
    }

    function prev() {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
    }

    function jump(page) {
        const pageNumber = Math.max(1, page);
        setCurrentPage(currentPage => Math.min(pageNumber, maxPage));
    }

    return { next, prev, jump, currentData, currentPage, maxPage };
}
