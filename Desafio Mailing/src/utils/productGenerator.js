import { faker } from '@faker-js/faker';

export const productGenerator = () => {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    image: faker.image.url(),
    stock: faker.datatype.number({ min: 0, max: 1000 }),
  };
};
