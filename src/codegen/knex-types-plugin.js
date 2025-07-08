const { pascalCase } = require('change-case-all');

const plugin = (schema, documents, config) => {
  // Obter os tipos do schema GraphQL
  const typeMap = schema.getTypeMap();
  const types = Object.values(typeMap).filter(type => !type.name.startsWith('__'));
  
  let content = `import type { Knex } from 'knex';

`;

  // Processar enums
  const enums = [];
  const objectTypes = [];

  // Primeiro passo: coletar todos os tipos
  for (const type of types) {
    if (type.astNode?.kind === 'EnumTypeDefinition') {
      enums.push(generateEnum(type));
    } else if (type.astNode?.kind === 'ObjectTypeDefinition' && 
               type.name !== 'Query' && 
               type.name !== 'Mutation') {
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
    content,
    prepend: [],
  };
};

function generateEnum(type) {
  const enumName = type.name;
  let enumContent = `// Enum para os tipos de ${enumName.toLowerCase()}\nexport enum ${enumName} {\n`;

  const values = type.getValues ? type.getValues() : [];
  for (const enumValue of values) {
    enumContent += `  ${enumValue.name} = '${enumValue.name}',\n`;
  }

  enumContent += '}';
  return enumContent;
}

function generateInterface(type) {
  const typeName = type.name;
  const dbTypeName = `${typeName}DB`;
  let interfaceContent = `// Interface para a tabela de ${typeName.toLowerCase()}\nexport interface ${dbTypeName} {\n`;

  const fields = type.getFields ? type.getFields() : {};
  for (const fieldName in fields) {
    const field = fields[fieldName];
    const dbFieldName = convertToDatabaseFieldName(fieldName);
    const fieldType = mapGraphQLTypeToTypeScript(field.type);
    interfaceContent += `  ${dbFieldName}: ${fieldType};\n`;
  }

  interfaceContent += '}';
  return interfaceContent;
}

function generateKnexModuleDeclaration(types) {
  let content = `// Declaração de módulo para estender os tipos do Knex\ndeclare module 'knex/types/tables' {\n  interface Tables {\n`;

  for (const type of types) {
    if (type.astNode?.kind === 'ObjectTypeDefinition' && 
        type.name !== 'Query' && 
        type.name !== 'Mutation') {
      const tableName = convertToTableName(type.name);
      const dbTypeName = `${type.name}DB`;
      
      content += `    ${tableName}: ${dbTypeName};\n`;
      content += `    ${tableName}_composite: Knex.CompositeTableType<\n`;
      content += `      ${dbTypeName},\n`;
      content += `      // Tipo para INSERT\n`;
      
      // Campos obrigatórios para INSERT (excluindo id, created_at, updated_at)
      const fields = type.getFields ? type.getFields() : {};
      const requiredFields = Object.keys(fields)
        .filter(name => name !== 'id' && name !== 'createdAt' && name !== 'updatedAt')
        .map(name => `'${convertToDatabaseFieldName(name)}'`)
        .join(' | ');
      
      content += `      Pick<${dbTypeName}, ${requiredFields}> & \n`;
      content += `        Partial<Pick<${dbTypeName}, 'created_at' | 'updated_at'>>,\n`;
      content += `      // Tipo para UPDATE\n`;
      content += `      Partial<Omit<${dbTypeName}, 'id'>>\n`;
      content += `    >;\n`;
    }
  }

  content += '  }\n}';
  return content;
}

function convertToDatabaseFieldName(fieldName) {
  // Casos especiais comuns
  if (fieldName === 'id') return 'id';
  if (fieldName === 'createdAt') return 'created_at';
  if (fieldName === 'updatedAt') return 'updated_at';
  
  // Conversão automática de camelCase para snake_case
  return fieldName.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function convertToTableName(typeName) {
  // Converter de PascalCase para snake_case e adicionar 's' no final
  const snakeCase = typeName.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1); // Remove o underscore inicial
  return snakeCase + 's';
}

function mapGraphQLTypeToTypeScript(type) {
  // Lidar com tipos não-nulos
  if (type.toString().includes('!')) {
    return mapGraphQLTypeToTypeScript(type.ofType || type);
  }

  // Lidar com listas
  if (type.toString().includes('[') && type.toString().includes(']')) {
    return `${mapGraphQLTypeToTypeScript(type.ofType || type)}[]`;
  }

  // Obter o nome do tipo
  const typeName = type.name || type.toString();

  // Mapear tipos escalares
  switch (typeName) {
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
      return 'String';
    default:
      // Para tipos personalizados (enums, objetos, etc.)
      return typeName;
  }
}

// Exportação para o GraphQL Codegen
module.exports = { plugin };