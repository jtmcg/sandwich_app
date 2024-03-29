import React, { useEffect, useState } from "react";
import "./createOrder.css";
import Menu from "../menu/Menu";
import RenderItemList from "../render_item_list/RenderItemList";
import Order from "../../src/order";
import Inventory from "../../src/inventory";

export default function CreateOrder(props) {
  const {
      data,
      addOrderToList,
      cancelOrderCreation,
      inventory,
      updateInventory
    } = props,
    [editingOrder, setEditingOrder] = useState(new Order(...data.clone())),
    [validName, setValidName] = useState(!!data.orderName),
    [editingInventory, setEditingInventory] = useState(
      new Inventory({ ...inventory.clone() })
    ),
    [editing] = useState(!!data.orderName);

  useEffect(() => {
    document.getElementById("orderName").value = editingOrder.orderName;
  }, []);

  const addItem = (item) => {
    const updatedOrder = new Order(...editingOrder.clone()),
      updatedInventory = new Inventory({ ...editingInventory.clone() });

    updatedInventory.subtractItemFromInventory(item);
    updatedOrder.addItem(item);

    setEditingOrder(updatedOrder);
    setEditingInventory(updatedInventory);
  };

  const removeItem = (index) => {
    const updatedOrder = new Order(...editingOrder.clone()),
      updatedInventory = new Inventory({ ...editingInventory.clone() }),
      removedItem = updatedOrder.removeItem(index)[0];

    updatedInventory.addItemToInventory(removedItem);

    setEditingOrder(updatedOrder);
    setEditingInventory(updatedInventory);
  };

  const changeOrderName = (event) => {
    const newName = event.target.value;
    const updatedOrder = new Order(...editingOrder.clone());

    updatedOrder.orderName = newName;

    setEditingOrder(updatedOrder);
    setValidName(!!newName);
  };

  const createOrder = () => {
    addOrderToList(editingOrder);
    updateInventory(editingInventory);
  };

  const dismissOrderCreation = () => {
    !editing && updateInventory(editingInventory);
    cancelOrderCreation();
  };

  return (
    <div className={"create-order_wrapper"}>
      <div className={"create-order_container"}>
        <div className={"create-order_top-line"}>
          <p className={"create-order_title"}>
            {editing ? "Edit" : "Create"} Order:
          </p>
          <input
            type={"text"}
            placeholder={"Order name"}
            id={"orderName"}
            onChange={changeOrderName}
            className={`create-order_name-input ${validName ? "" : "required"}`}
          />
          {validName && (
            <label className={"required-label"} htmlFor={"orderName"}>
              *required
            </label>
          )}
        </div>
        {/* <div>{JSON.stringify(editingInventory)}</div> */}
        <div className={"create-order_selection-container"}>
          <h4>Sandwiches</h4>
          <Menu addItem={addItem} inventory={editingInventory.inventory} />
          <hr />
        </div>
        <div className={"create-order_order-summary-container"}>
          {editingOrder && editingOrder.itemList && (
            <RenderItemList
              order={editingOrder}
              size={"medium"}
              removeItem={removeItem}
            />
          )}
        </div>
        <div className={"create-order_buttons-container"}>
          <button className={"button_secondary"} onClick={dismissOrderCreation}>
            Cancel
          </button>
          <button
            className={`button_primary ${
              !(validName && editingOrder.itemList.length !== 0) &&
              "button_disabled"
            }`}
            onClick={(currentOrder) => createOrder(currentOrder)}
            disabled={!validName || editingOrder.itemList.length === 0}
          >
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
