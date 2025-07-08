"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plugin = function (schema, documents, config) {
    var types = schema.types;
    var content = "import type { Knex } from 'knex';\n\n";
    // Processar enums
    var enums = [];
    var objectTypes = [];
    // Primeiro passo: coletar todos os tipos
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var type = types_1[_i];
        if (type.kind === 'ENUM') {
            enums.push(generateEnum(type));
        }
        else if (type.kind === 'OBJECT' && type.name !== 'Query' && type.name !== 'Mutation') {
            objectTypes.push(generateInterface(type));
        }
    }
    // Adicionar enums ao conteúdo
    content += enums.join('\n\n');
    content += '\n\n';
    // Adicionar interfaces ao conteúdo
    content += objectTypes.join('\n\n');
    content += '\n\n';
    // Adicionar declaração de módulo para o Knex
    content += generateKnexModuleDeclaration(types);
    return {
        content: content,
        prepend: [],
    };
};
function generateEnum(type) {
    var enumName = type.name;
    var enumContent = "// Enum para os tipos de ".concat(enumName.toLowerCase(), "\nexport enum ").concat(enumName, " {\n");
    for (var _i = 0, _a = type.values; _i < _a.length; _i++) {
        var enumValue = _a[_i];
        enumContent += "  ".concat(enumValue.name, " = '").concat(enumValue.name, "',\n");
    }
    enumContent += '}';
    return enumContent;
}
function generateInterface(type) {
    var typeName = type.name;
    var dbTypeName = "".concat(typeName, "DB");
    var interfaceContent = "// Interface para a tabela de ".concat(typeName.toLowerCase(), "\nexport interface ").concat(dbTypeName, " {\n");
    for (var _i = 0, _a = type.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        var fieldName = convertToDatabaseFieldName(field.name);
        var fieldType = mapGraphQLTypeToTypeScript(field.type);
        interfaceContent += "  ".concat(fieldName, ": ").concat(fieldType, ";\n");
    }
    interfaceContent += '}';
    return interfaceContent;
}
function generateKnexModuleDeclaration(types) {
    var content = "// Declara\u00E7\u00E3o de m\u00F3dulo para estender os tipos do Knex\ndeclare module 'knex/types/tables' {\n  interface Tables {\n";
    for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
        var type = types_2[_i];
        if (type.kind === 'OBJECT' && type.name !== 'Query' && type.name !== 'Mutation') {
            var tableName = convertToTableName(type.name);
            var dbTypeName = "".concat(type.name, "DB");
            content += "    ".concat(tableName, ": ").concat(dbTypeName, ";\n");
            content += "    ".concat(tableName, "_composite: Knex.CompositeTableType<\n");
            content += "      ".concat(dbTypeName, ",\n");
            content += "      // Tipo para INSERT\n";
            // Campos obrigatórios para INSERT (excluindo id, created_at, updated_at)
            var requiredFields = type.fields
                .filter(function (f) { return f.name !== 'id' && f.name !== 'createdAt' && f.name !== 'updatedAt'; })
                .map(function (f) { return "'".concat(convertToDatabaseFieldName(f.name), "'"); })
                .join(' | ');
            content += "      Pick<".concat(dbTypeName, ", ").concat(requiredFields, "> & \n");
            content += "        Partial<Pick<".concat(dbTypeName, ", 'created_at' | 'updated_at'>>,\n");
            content += "      // Tipo para UPDATE\n";
            content += "      Partial<Omit<".concat(dbTypeName, ", 'id'>>\n");
            content += "    >;\n";
        }
    }
    content += '  }\n}';
    return content;
}
function convertToDatabaseFieldName(fieldName) {
    // Casos especiais comuns
    if (fieldName === 'id')
        return 'id';
    if (fieldName === 'createdAt')
        return 'created_at';
    if (fieldName === 'updatedAt')
        return 'updated_at';
    // Conversão automática de camelCase para snake_case
    return fieldName.replace(/([A-Z])/g, '_$1').toLowerCase();
}
function convertToTableName(typeName) {
    // Converter de PascalCase para snake_case e adicionar 's' no final
    var snakeCase = typeName.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1); // Remove o underscore inicial
    return snakeCase + 's';
}
function mapGraphQLTypeToTypeScript(type) {
    // Lidar com tipos não-nulos
    if (type.kind === 'NON_NULL') {
        return mapGraphQLTypeToTypeScript(type.ofType);
    }
    // Lidar com listas
    if (type.kind === 'LIST') {
        return "".concat(mapGraphQLTypeToTypeScript(type.ofType), "[]");
    }
    // Mapear tipos escalares
    switch (type.name) {
        case 'ID':
            return 'number';
        case 'String':
            return 'string';
        case 'Int':
            return 'number';
        case 'Float':
            return 'number';
        case 'Boolean':
            return 'boolean';
        case 'Date':
            return 'Date';
        default:
            // Para tipos personalizados (enums, objetos, etc.)
            if (type.kind === 'ENUM') {
                return type.name;
            }
            return type.name;
    }
}
// Exportação para o GraphQL Codegen
module.exports = { plugin: plugin };
