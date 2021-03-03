import React, {Fragment, useState} from "react";
import {EuiBadge, EuiBadgeGroup, EuiFieldSearch, EuiInMemoryTable} from "@elastic/eui";
import EllipsisText from "react-ellipsis-text";

function Foo(
  {
    versions = [],
    loading = true,
    query,
    setQuery,
  }
) {

  const [search, setSearch] = useState("")

  // environment_name: dev
  // environment_name: dev labels: bar IN (bar1)
  // labels: foo IN (foo1)
  // labels: foo IN (foo1, foo2)

  const onChange = e => {

  }

  return (
    <Fragment>
      <EuiFieldSearch
        fullWidth={true}
        placeholder="Search..."
        onChange={(e) => {
          setSearch(e.target.value)
          console.log("onchange:", e.target.value)
          if (!e.target.value) {
            console.log("HERE")
            setQuery("")
          }
        }}
        onSearch={() => {
          setQuery(search)
        }}
        value={search}/>

      <EuiInMemoryTable
        items={versions}
        loading={loading}
        columns={[
          {
            field: 'id',
            name: 'id',
          },
          {
            field: 'labels',
            name: 'labels',
            render: labels =>
              <EuiBadgeGroup>
                {labels && Object.entries(labels)
                  .map(
                    ([key, val]) =>
                      <EuiBadge
                        key={key}
                        onClick={() => {
                          setSearch(`labels: ${key} IN (${val})`)
                          setQuery(`labels: ${key} IN (${val})`)
                        }}
                        onClickAriaLabel="Query by label">
                        <EllipsisText text={key} length={9}/>:<EllipsisText text={val} length={9}/>
                      </EuiBadge>
                  )
                }
              </EuiBadgeGroup>
          },
        ]}
        pagination={true}
        sorting={true}
      />
    </Fragment>
  );
}

export default Foo;