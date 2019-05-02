import React, { Component } from "react";
import _ from "lodash";

class Pagination extends Component {
  getElements = ({ itemsCount, currentPage, pageSize }) => {
    // First < 9, 10 current 12, 13 > Last
    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount > 9) {
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(pagesCount - 1, currentPage + 2);

      let pages = _.range(startPage, endPage + 1);

      const hasLeft = startPage > 2;
      let hasRight = pagesCount - endPage;
      hasRight = hasRight > 1;
      const offset = 7 - (pages.length + 1);

      if (hasLeft && !hasRight) {
        const otherPages = _.range(startPage - offset, startPage);
        pages = ["<", ...otherPages, ...pages];
      } else if (!hasLeft && hasRight) {
        const otherPages = _.range(endPage + 1, endPage + offset + 1);
        pages = [...pages, ...otherPages, ">"];
      } else {
        pages = ["<", ...pages, ">"];
      }
      return ["First", ...pages, "Last"];
    }
    let pages = _.range(1, pagesCount + 1);
    pages[0] = "First";
    return pages;
  };

  render() {
    const { currentPage, itemsCount, pageSize, onPageChange } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);
    if (pagesCount === 1) return null;
    const pages = this.getElements(this.props);
    return (
      <nav>
        <ul className="pagination justify-content-center">
          {pages.map(page => {
            let pageIndex = page;
            if (page === "First") pageIndex = 1;
            if (page === "Last") pageIndex = pagesCount;
            if (page === "<") pageIndex = _.nth(pages, 1) - 1;
            if (page === ">") pageIndex = _.nth(pages, -3) + 1;

            return (
              <li
                key={pageIndex}
                className={
                  pageIndex === currentPage ? "page-item active" : "page-item"
                }
              >
                <button
                  onClick={() => onPageChange(pageIndex)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
