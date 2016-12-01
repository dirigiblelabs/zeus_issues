/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var issuesDaoExtensionsUtils = require('zeus/issues/issuesDaoExtensionUtils');
var user = require("net/http/user");

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO ZEUS_ISSUES (ISSUE_ID,ISSUE_NAME,ISSUE_DESCRIPTION,ISSUE_AUTHOR,ISSUE_DATE,ISSUE_ASSIGNEE,ISSUE_PROJECT_ID,ISSUE_STATUS) VALUES (?,?,?,?,?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('ZEUS_ISSUES_ISSUE_ID').next();
        statement.setInt(++i, id);
        statement.setString(++i, entity.issue_name);
        statement.setString(++i, entity.issue_description);
        statement.setString(++i, user.getName());
        statement.setTimestamp(++i, new Date());
        statement.setString(++i, entity.issue_assignee);
        statement.setInt(++i, entity.issue_project_id);
        statement.setInt(++i, entity.issue_status);
		issuesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        issuesDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM ZEUS_ISSUES WHERE ISSUE_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM ZEUS_ISSUES';
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

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE ZEUS_ISSUES SET ISSUE_NAME = ?,ISSUE_DESCRIPTION = ?,ISSUE_ASSIGNEE = ?,ISSUE_PROJECT_ID = ?,ISSUE_STATUS = ? WHERE ISSUE_ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setString(++i, entity.issue_name);
        statement.setString(++i, entity.issue_description);
        statement.setString(++i, entity.issue_assignee);
        statement.setInt(++i, entity.issue_project_id);
        statement.setInt(++i, entity.issue_status);
        var id = entity.issue_id;
        statement.setInt(++i, id);
		issuesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        issuesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM ZEUS_ISSUES WHERE ISSUE_ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.issue_id);
        issuesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        issuesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM ZEUS_ISSUES';
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
		name: 'zeus_issues',
		type: 'object',
		properties: [
		{
			name: 'issue_id',
			type: 'integer',
			key: 'true',
			required: 'true'
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
			name: 'issue_status',
			type: 'integer'
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
	result.issue_status = resultSet.getInt('ISSUE_STATUS');
    return result;
}

