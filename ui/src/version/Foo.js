import React, {useState} from 'react';
import {EuiBadge, EuiHealth, EuiInMemoryTable, EuiLink,AST,Query,EuiSearchBar} from '@elastic/eui';

/*
Example user object:

{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  dateOfBirth: Date.now(),
  nationality: 'NL',
  online: true
}

Example country object:

{
  code: 'NL',
  name: 'Netherlands',
  flag: '🇳🇱'
}
*/

let debounceTimeoutId;
let requestTimeoutId;

const users = [
  {
    id: '1',
    firstName: 'john',
    lastName: 'doe',
    github: 'johndoe',
    dateOfBirth: Date.now(),
    nationality: 'NL',
    online: true
  },
  {
    id: '2',
    firstName: 'john',
    lastName: 'cormick',
    github: 'johndoe',
    dateOfBirth: Date.now(),
    nationality: 'NL',
    online: true
  },
  {
    id: '3',
    firstName: 'jane',
    lastName: 'doe',
    github: 'johndoe',
    dateOfBirth: Date.now(),
    nationality: 'NL',
    online: true
  },
]

const Foo = () => {
  const [items, setItems] = useState(users);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const onQueryChange = ({query, queryText, error}) => {
    console.log("onQueryChange", queryText, query)

    if (error) {
      console.log("Error: ", error)
    }

    // Is this necessary?
    const q = new EuiSearchBar.Query.parse("")
    q.text = queryText
    setQuery(q)
    // setQuery(query.text)

    clearTimeout(debounceTimeoutId);
    clearTimeout(requestTimeoutId);

    debounceTimeoutId = setTimeout(() => {
      setIsLoading(true);

      requestTimeoutId = setTimeout(() => {
        const items = users.filter((user) => {
          const normalizedName = `${user.firstName} ${user.lastName}`.toLowerCase();
          const normalizedQuery = queryText.toLowerCase();
          return normalizedName.indexOf(normalizedQuery.substring(0, 4)) !== -1;
        });

        setIsLoading(false);
        setItems(items);
      }, 1000);
    }, 300);
  };

  const search = {
    defaultQuery: " ",
    query: query,
    onChange: onQueryChange,
    box: {
      incremental: false,
      schema: {
        strict: false,
        fields: {
          firstName: {
            type: "string",
            validate: (value) => true
          }
        }
      }
    },
  };

  return (
    <EuiInMemoryTable
      items={items}
      loading={isLoading}
      columns={[
        {
          field: 'firstName',
          name: 'First Name',
          sortable: true,
          truncateText: true,
          render: (name) =>
            <EuiBadge
              onClickAriaLabel="dummy"
              onClick={() => {
                onQueryChange({queryText:`${name} in (a,b,c)`})

                // const q = new EuiSearchBar.Query.parse("")
                // console.log(JSON.stringify(q))
                // q.text = "name in (a,b,c)"
                // q.error = null
                // q.text = "a in (b,c)"
                // q.parse = () => new EuiSearchBar.Query(null, null, "a in (b,c)")
                // q.ast = {clauses: []}

                // q.parse = () => new Query(Syntax.parse(""), Syntax, "a in (b,c)")
                // onQueryChange({query: {text: "firstName: bar in (foo,bar)"}})
                // onQueryChange({query: new Query("firstName: bar in (foo,bar)")})
                // setQuery(q)
              }}>
              {name}
            </EuiBadge>
        },
        {
          field: 'lastName',
          name: 'Last Name',
          truncateText: true,
        },
        {
          field: 'github',
          name: 'Github',
          render: (username) => (
            <EuiLink href={`https://github.com/${username}`} target="_blank">
              {username}
            </EuiLink>
          ),
        },
        {
          field: 'dateOfBirth',
          name: 'Date of Birth',
          dataType: 'date',
          sortable: true,
        },
        {
          field: 'nationality',
          name: 'Nationality',
        },
        {
          field: 'online',
          name: 'Online',
          dataType: 'boolean',
          render: (online) => {
            const color = online ? 'success' : 'danger';
            const label = online ? 'Online' : 'Offline';
            return <EuiHealth color={color}>{label}</EuiHealth>;
          },
          sortable: true,
        },
      ]}
      search={search}
      pagination={true}
      sorting={true}
    />
  );
};

export default Foo;