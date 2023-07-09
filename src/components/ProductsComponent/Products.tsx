import { useEffect, useState } from "react";
import "./Products.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsWithoutFilter, setProductsWithoutFilter] = useState<Product[]>(
    []
  );

  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [isNewProduct, setIsNewProduct] = useState(false);

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    axios
      .get("https://localhost:7083/api/Products")
      .then((result) => {
        setProducts(result.data);
        setProductsWithoutFilter(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addClick = () => {
    setIsNewProduct((prevState) => true);
    setModalTitle((prevState) => "Add Product");
    setEditName((prevState) => "");
    setEditCategory((prevState) => "");
    setEditPrice((prevState) => "");
    setEditStock((prevState) => "");
  };

  const editClick = (product: Product) => {
    setIsNewProduct((prevState) => false);
    setModalTitle((prevState) => "Edit Product");
    setEditName((prevState) => product.name);
    setEditCategory((prevState) => product.category);
    setEditPrice((prevState) => "" + product.price);
    setEditStock((prevState) => "" + product.stock);
  };

  const deleteClick = (product: Product) => {
    console.log(product);
    if (window.confirm("Are you sure?") == true)
      axios
        .delete(`https://localhost:7083/api/Products/id?id=${product.id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Product has been deleted.");
            getAllProducts();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  const createClick = () => {
    const url = "https://localhost:7083/api/Products";
    const product = {
      name: editName,
      category: editCategory,
      price: +editPrice,
      stock: +editStock,
    };

    axios
      .post(url, product)
      .then((result) => {
        getAllProducts();
        clear();
        toast.success("Product has been added.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setEditName("");
    setEditCategory("");
    setEditPrice("");
    setEditStock("");
    setModalTitle((prevState) => "");
  };

  const updateClick = () => {
    const url = `https://localhost:7083/api/Products/id?id=${3}`;
    const product = {
      name: editName,
      category: editCategory,
      price: +editPrice,
      stock: +editStock,
    };

    axios
      .put(url, product)
      .then((result) => {
        getAllProducts();
        clear();
        toast.success("Product has been updated.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const applyFilter = (
    filter: { type: string; item: string } | { type: string; item: number }
  ) => {
    if (nameFilter == "" && categoryFilter == "") {
      setProducts((prevState) => productsWithoutFilter);
      return;
    }

    let filteredProducts: Product[];

    switch (filter.type) {
      case "name":
        filteredProducts = productsWithoutFilter.filter((prod) =>
          prod.name
            .toLocaleLowerCase()
            .includes(("" + filter.item).toLocaleLowerCase())
        );
        setProducts((prevState) => filteredProducts);
        break;
      case "category":
        filteredProducts = productsWithoutFilter.filter((prod) =>
          prod.category
            .toLocaleLowerCase()
            .includes(("" + filter.item).toLocaleLowerCase())
        );
        setProducts((prevState) => filteredProducts);
        break;
    }
    return;
  };

  const changeNameFilter = (value: string) => {
    setNameFilter((prevState) => value);
    applyFilter({ item: value, type: "name" });
  };

  const changeCategoryFilter = (value: string) => {
    setCategoryFilter((prevState) => value);
    applyFilter({ item: value, type: "category" });
  };

  const sortResult = (prop: keyof Product, asc: boolean) => {
    let sortedData = products.sort((a, b) => {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });
    console.log("sortedData");
    console.log(sortedData);

    setProducts((prevState) => [...sortedData]);
  };

  return (
    <div>
      <ToastContainer />
      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => addClick()}
      >
        Add Product
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>
              <div className="filter-class">
                <div className="input-div">
                  <input
                    className="form-control filter-input"
                    onChange={(e) => changeNameFilter(e.target.value)}
                    placeholder="Filter"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-light button-border"
                    onClick={() => sortResult("name", true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-square-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light button-border"
                    onClick={() => sortResult("name", false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-square-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              Name
            </th>
            <th>
              <div className="filter-class">
                <div className="input-div">
                  <input
                    className="form-control filter-input"
                    onChange={(e) => changeCategoryFilter(e.target.value)}
                    placeholder="Filter"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-light button-border"
                    onClick={() => sortResult("category", true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-square-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light button-border"
                    onClick={() => sortResult("category", false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-square-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              Category
            </th>
            <th>
              <div className="d-flex flex-row sort-icons">
                <button
                  type="button"
                  className="btn btn-light button-border"
                  onClick={() => sortResult("price", true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="btn btn-light button-border"
                  onClick={() => sortResult("price", false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>
              </div>
              Price
            </th>
            <th>
              <div className="d-flex flex-row sort-icons">
                <button
                  type="button"
                  className="btn btn-light button-border"
                  onClick={() => sortResult("stock", true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="btn btn-light button-border"
                  onClick={() => sortResult("stock", false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>
              </div>
              Stock
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod.id}>
              <td></td>
              <td>{index + 1}</td>
              <td>{prod.name}</td>
              <td>{prod.category}</td>
              <td>{prod.price}</td>
              <td>{prod.stock}</td>
              <td>
                <div className="actions-class">
                  <div>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => editClick(prod)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      onClick={() => deleteClick(prod)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content modal-width">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="input-group mb-3 input-width input-width">
                <div className="input-title">
                  <span className="input-group-text">Name</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName((prevState) => e.target.value)}
                />
              </div>
              <div className="input-group mb-3 input-width">
                <div className="input-title">
                  <span className="input-group-text">Category</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={editCategory}
                  onChange={(e) =>
                    setEditCategory((prevState) => e.target.value)
                  }
                />
              </div>
              <div className="input-group mb-3 input-width">
                <div className="input-title">
                  <span className="input-group-text">Price</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={editPrice}
                  onChange={(e) => setEditPrice((prevState) => e.target.value)}
                />
              </div>
              <div className="input-group mb-3 input-width">
                <div className="input-title">
                  <span className="input-group-text">Stock</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={editStock}
                  onChange={(e) => setEditStock((prevState) => e.target.value)}
                />
              </div>

              {isNewProduct ? (
                <button
                  type="button"
                  className="btn btn-primary float-start"
                  onClick={() => createClick()}
                >
                  Create
                </button>
              ) : null}

              {!isNewProduct ? (
                <button
                  type="button"
                  className="btn btn-primary float-start"
                  onClick={() => updateClick()}
                >
                  Update
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
