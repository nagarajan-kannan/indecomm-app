import React, { Component } from 'react';
import './expense-planner.css'

const STORAGE = '@DATA/Statements';

export class ExpensePlanner extends Component {

  constructor(props) {
    super(props);

    // Assign the state with an initial value
    this.state = {
      statements: JSON.parse(localStorage.getItem(STORAGE)) || [],
      canEnableForm: false,
      income: () => {
        const incomes = this.state.statements.filter(t => t.type === 'income');
        return incomes.reduce(this.sumAmount, 0);
      },
      expense: () => {
        const incomes = this.state.statements.filter(t => t.type === 'expense');
        return incomes.reduce(this.sumAmount, 0);
      },
      balance: () => {
        return this.state.income() - this.state.expense();
      }
    };
  }

  /**
   * Return the sum of total amount
   * @param {number} total
   * @param {any} item
   * @returns {number}
   */
  sumAmount = (total, item) => {
    return total + Number(item.amount);
  };

  /**
   * Method to add a new entry into statements
   * @param {any} event
   */
  addStatement = (event) => {
    const statement = {
      id: Date.now(),
      date: `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
      amount: event.target.amount?.value,
      remarks: event.target.remarks?.value,
      type: this.state.activeStatementType
    }; // Form the new statment object

    const updatedStatements = [...this.state.statements, ...[statement]]; // update the statements

    // Update both component state and storage
    localStorage.setItem(STORAGE, JSON.stringify(updatedStatements));
    this.setState({ statements: updatedStatements });

    this.removeForm();
  };

  /**
   * Delete the target statment from list
   * @param {any} statement
   */
  deleteStatement = (statment) => {
    const updatedStatements = this.state.statements.filter(t => t.id !== statment.id); // update the statements

    // Update both component state and storage
    localStorage.setItem(STORAGE, JSON.stringify(updatedStatements));
    this.setState({ statements: updatedStatements });
  };

  /**
   * Enable the form JSX element set
   * @param {string} type
   */
  enableForm = (type = 'income') => {
    this.setState({ canEnableForm: true, activeStatementType: type });
  };

  /**
   * Remove the form and add action buttons
   */
  removeForm = () => {
    this.setState({ canEnableForm: false });
  };

  /**
   * Hook to render the DOM
   */
  render() {
    let dynamicElement;

    if (this.state.canEnableForm) { // Add form elements
      dynamicElement = (
        <section className="form-section">
          <form onSubmit={this.addStatement}>
            <h4>Add {this.state.activeStatementType === 'income' ? 'Income' : 'Spending'}</h4>
            <div className="wrapper">
              <div className="fields">
                <input type="number" name="amount" placeholder="Amount" min="0" />
                <input type="text" name="remarks" placeholder="Remarks" />
              </div>
              <div className="actions">
                <button type="submit">Submit</button>
                <button type="button" className="cancel" onClick={this.removeForm}>Cancel</button>
              </div>
            </div>
          </form>
        </section>
      );
    } else { // Add action button elements
      dynamicElement = (
        <section className="button-section">
          <button type="button" onClick={() => this.enableForm()}>Add Income</button>
          <button type="button" onClick={() => this.enableForm('expense')} className="expense">Add Spending</button>
        </section>
      );
    }

    return (
      <main className="planner-page">

        <section className="summary-section">
          <span className="balance">Balance</span>
          <h4>{this.state.balance()} czk</h4>
          <h5>
            <span className="income">Income: {this.state.income()}  Kc</span>
            <span className="expense">Spendings: {this.state.expense()}  Kc</span>
          </h5>
        </section>

        <section className="list-section">
          {
            this.state.statements.map((item, i) => {
              return (
                <div className={`item ${item?.type}`} key={i}>
                  <span className="date">{item?.date}</span>
                  <div className="flex">
                    <span className="amount">{item?.amount} Kc</span>
                    <span className="desc">{item?.remarks}</span>
                  </div>
                  <span className="delete" onClick={() => this.deleteStatement(item)}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </span>
                </div>
              );
            })
          }
        </section>

        {dynamicElement}
      </main>
    )
  }

}
