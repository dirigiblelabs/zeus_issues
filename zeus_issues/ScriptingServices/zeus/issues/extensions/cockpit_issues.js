/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/issues";
const HTML_LINK = "../../zeus_issues/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Issues",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Issues",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Develop",
      "order": 204
   };
};
