/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_ISSUES_VIEW';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_ISSUES_VIEW';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'zeus_issues_view',
		type: 'object',
		properties: [
		{
			name: 'issue_id',
			type: 'integer'
		},
		{
			name: 'issue_name',
			type: 'string'
		},
		{
			name: 'issue_description',
			type: 'string'
		},
		{
			name: 'issue_author',
			type: 'string'
		},
		{
			name: 'issue_date',
			type: 'timestamp'
		},
		{
			name: 'issue_assignee',
			type: 'string'
		},
		{
			name: 'issue_project_id',
			type: 'integer'
		},
		{
			name: 'issue_istatus_id',
			type: 'integer'
		},
		{
			name: 'project_name',
			type: 'string'
		},
		{
			name: 'istatus_name',
			type: 'string'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
	result.issue_id = resultSet.getInt('ISSUE_ID');
    result.issue_name = resultSet.getString('ISSUE_NAME');
    result.issue_description = resultSet.getString('ISSUE_DESCRIPTION');
    result.issue_author = resultSet.getString('ISSUE_AUTHOR');
    if (resultSet.getTimestamp('ISSUE_DATE') !== null) {
        result.issue_date = new Date(resultSet.getTimestamp('ISSUE_DATE').getTime());
    } else {
        result.issue_date = null;
    }
    result.issue_assignee = resultSet.getString('ISSUE_ASSIGNEE');
	result.issue_project_id = resultSet.getInt('ISSUE_PROJECT_ID');
	result.issue_istatus_id = resultSet.getInt('ISSUE_ISTATUS_ID');
    result.project_name = resultSet.getString('PROJECT_NAME');
    result.istatus_name = resultSet.getString('ISTATUS_NAME');
    return result;
}

