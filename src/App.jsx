/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(c => c.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer
    .find(u => u.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

console.log(products);

const sortByDafault = {
  user: 'All',
  category: '',
  search: '',
};

function getPreparedProducts(prods, { user, category, search }) {
  let result;

  if (user === 'All') {
    result = prods;
  } else {
    result = prods.filter(prod => prod.user.name === user);
  }

  if (category !== '') {
    result = result.filter(cate => cate.categoryId === category);
  }

  console.log(search);

  if (search !== '' && result.length !== 0) {
    const normalizedSearch = search.trim().toLowerCase();

    console.log(result);

    result = result
      .filter(prod => prod.name.toLowerCase().includes(normalizedSearch));
  }

  return result;
}

export const App = () => {
  const [sortBy, setSortBy] = useState(sortByDafault);

  const preparedProducts = getPreparedProducts(products, sortBy);

  console.log(preparedProducts);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={sortBy.user === 'All' ? 'is-active' : ''}
                onClick={() => setSortBy({ ...sortBy, user: 'All' })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={sortBy.user === user.name ? 'is-active' : ''}
                  onClick={() => setSortBy({ ...sortBy, user: user.name })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={event => setSortBy({
                    ...sortBy, search: event.target.value,
                  })}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', 'is-outlined', {
                  'is-info': sortBy.category === '',
                })}
                onClick={() => setSortBy({ ...sortBy, category: '' })}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': sortBy.category === category.id,
                  })}
                  href="#/"
                  onClick={() => setSortBy({
                    ...sortBy, category: category.id,
                  })}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => setSortBy(sortByDafault)}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {preparedProducts.length !== 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {preparedProducts.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className="has-text-link"
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
