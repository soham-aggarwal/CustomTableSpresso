import * as React from "react";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";

import styled, { css } from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";
import { Input } from "@mui/base";


const COLUMNS = [
  { name: "Name", type: "" },
  { name: "Age", type: 0 },
  { name: "Status", type: false },
  { name: "Height", type: 0 },
];
const Button = styled.button<{ $primary?: boolean; }>``;

const Table = styled.table`
border: 1px solid;
border-collapse: collapse;
`;

const Thead = styled.thead`border: 1px solid;

`;

const Td = styled.td`border: 1px solid;`;

function TableRow({ item, index, setSelectedRows }: {
  item: {
    [key: string]: number | string | boolean,
    id: number;
    name: string;
    age: number;
    status: boolean;
    height: number;
  },
  setSelectedRows: (update: any) => void;
  index: number,
}) {
  return <tr key={index}>
    <Td>
      <Checkbox
        onClick={(e: any) => {
          if (e.target.checked) {
            setSelectedRows((selectedRows: any) => [...selectedRows, item]);
          } else {
            setSelectedRows((selectedRows: any) =>
              selectedRows.filter((row: { id: number; }) => row.id !== item.id),
            );
          }
        }}
      />
    </Td>
    <Td>{item.name}</Td>
    <Td >{item.age}</Td>
    <Td>{item.status ? 'Active' : 'Inactive'}</Td>
    <Td>{item.height}</Td>
  </tr>

}

function CustomTable() {
  const [data, setData] = React.useState<
    Array<{
      [key: string]: number | string | boolean,
      id: number;
      name: string;
      age: number;
      status: boolean;
      height: number;
    }>
  >([]);
  const [pageNum, setPageNum] = React.useState(1);

  const [isLoading, setIsLoading] = React.useState(true);

  const [sort, setSort] = React.useState('');

  const [selectedRows, setSelectedRows] = React.useState<
    Array<{
      id: number;
      name: string;
      age: number;
      status: boolean;
      height: number;
    }>
  >([]);

  const [filterValue, setFilterValue] = React.useState(0);


  const fetchData = () => {
    const x = setTimeout(() => {
      const values = Array(25).fill('').map((_, index) => {
        return {
          id: index * pageNum,
          name: (Math.random() + 1).toString(36).substring(7),
          age: Math.floor(Math.random() * (50 - 12) + 12),
          status: Boolean(Math.round(Math.random())),
          height: Math.floor(Math.random() * (200 - 90) + 90)
        }
      });

      setIsLoading(false);
      setData(values);
    }, 750,);
    return x;
  }

  React.useEffect(() => {
    fetchData();
  }, [pageNum])


  React.useEffect(() => {
    const values = fetchData();
    console.log(values);
  }, []);

  return (
    <Container>
      <Container style={{
        height: '50px',
      }}>
        <Input
          type="number"
          placeholder="Enter Age to find greater than"
          onChange={(e) => {
            setFilterValue(Number(e.target.value));
          }}
          style={{
            width: '100%'
          }}
        />
        <Container>
          {`Current Page: ${pageNum}`}
        </Container>

      </Container>
      <Table width={'100%'}>
        <Thead>
          <tr>
            <Td width={'fit-content'}></Td>
            {COLUMNS.map((col) => {
              return (
                <Td onClick={() => {
                  //sorting here
                  if (col.name === 'Age' || col.name === 'Height') {
                    if (!sort || sort === 'DSC') {
                      setData(data.sort((a, b) => {
                        return Number(a[col.name.toLowerCase()]) - Number(b[col.name.toLowerCase()])
                      }));
                      setSort('ASC');
                    } else if (sort === 'ASC') {
                      setData(data.sort((a, b) => {
                        return Number(b[col.name.toLowerCase()]) - Number(a[col.name.toLowerCase()])
                      }));
                      setSort('DSC');
                    }
                  }
                }}
                  key={col.name}>
                  {col.name}
                </Td>
              );
            })}
          </tr>
        </Thead>

        <tbody>
          {isLoading ?
            <Container style={{
              height: '100%',
            }}>
              <ClipLoader loading />
            </Container>
            : filterValue ? data.filter(item => item.age > filterValue).map((item, index) => {
              return <TableRow item={item} setSelectedRows={setSelectedRows} index={index} />
            })
              : data.map((item, index) => {
                return (
                  <tr key={index}>
                    <Td>
                      <Checkbox
                        onClick={(e: any) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, item]);
                          } else {
                            setSelectedRows(
                              selectedRows.filter((row) => row.id !== item.id),
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>{item.name}</Td>
                    <Td >{item.age}</Td>
                    <Td>{item.status ? 'Active' : 'Inactive'}</Td>
                    <Td>{item.height}</Td>
                  </tr>
                );
              })}
        </tbody>
      </Table>

      <Container style={{
        display: "flex",
        justifyContent: 'space-between',
        paddingTop: '2em',
        paddingBottom: '2em',

      }} >
        <Button disabled={pageNum === 1} onClick={() => {
          setPageNum(pageNum - 1);
          setIsLoading(true);
          setSelectedRows([]);

        }}>
          Previous
        </Button>
        <Container>
          {`Current Page: ${pageNum}`}
        </Container>
        <Button disabled={pageNum === 4} onClick={() => {
          setPageNum(pageNum + 1);
          setIsLoading(true);
          setSelectedRows([]);
        }}>
          Next
        </Button>

      </Container>

      {selectedRows.length ? <Container>
        <Container> <h2>Selected Rows</h2> </Container>
        {selectedRows.map(row => <pre>{JSON.stringify(row, null, 5)}</pre>)}
      </Container> : <></>}
    </Container>
  );
}

export default function App() {
  return (
    <Container maxWidth="sm">
      <CustomTable />
    </Container>
  );
}
