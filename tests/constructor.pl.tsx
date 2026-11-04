import { expect, test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Page } from '@playwright/test';

const HARS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'hars');

const BUN_ID = 'bun-1';
const MAIN_ID = 'main-1';
const BUN_NAME = 'Флюоресцентная булка R2-D3';
const MAIN_NAME = 'Говяжий метеорит (отбивная)';

const mockIngredients = async (page: Page): Promise<void> => {
  await page.routeFromHAR(path.join(HARS_DIR, 'ingredients.har'), {
    url: '**/api/ingredients',
    update: false
  });
};

const mockUser = async (page: Page): Promise<void> => {
  await page.routeFromHAR(path.join(HARS_DIR, 'user.har'), {
    url: '**/api/auth/user',
    update: false
  });
};

const mockOrders = async (page: Page): Promise<void> => {
  await page.routeFromHAR(path.join(HARS_DIR, 'orders.har'), {
    url: '**/api/orders',
    update: false
  });
};

const mockAuth = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    document.cookie = 'accessToken=Bearer fake-access-token; path=/; max-age=3600';
  });
};

const ingredientCard = (page: Page, id: string) =>
  page.getByTestId(`ingredient-card-${id}`);

const addButton = (page: Page, id: string) =>
  ingredientCard(page, id).getByRole('button', { name: 'Добавить' });

const modalRoot = (page: Page) => page.locator('#modals');
const modalOverlay = (page: Page) => page.getByTestId('modal-overlay');

const orderModalCaption = (page: Page) =>
  modalRoot(page).getByText('идентификатор заказа');

const constructorElements = (page: Page) =>
  page.locator('.constructor-element');

const constructorElement = (page: Page, name: string) =>
  constructorElements(page).filter({ hasText: name });

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
  });

  test('булка добавляется в конструктор дважды (сверху и снизу)', async ({
    page
  }) => {
    await addButton(page, BUN_ID).click();

    await expect(constructorElement(page, BUN_NAME)).toHaveCount(2);
  });

  test('начинка добавляется в конструктор один раз', async ({ page }) => {
    await addButton(page, BUN_ID).click();
    await addButton(page, MAIN_ID).click();

    await expect(constructorElement(page, MAIN_NAME)).toHaveCount(1);
    await expect(constructorElement(page, BUN_NAME)).toHaveCount(2);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
    await ingredientCard(page, BUN_ID).click();
  });

  test('открывается по клику на ингредиент и показывает данные этого ингредиента', async ({
    page
  }) => {
    const modal = modalRoot(page);

    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
    await expect(modal.getByRole('heading', { name: BUN_NAME })).toBeVisible();

    await expect(modal).toContainText('Калории, ккал');
    await expect(modal).toContainText('420');
    await expect(modal).toContainText('Белки, г');
    await expect(modal).toContainText('80');
    await expect(modal).toContainText('Жиры, г');
    await expect(modal).toContainText('24');
    await expect(modal).toContainText('Углеводы, г');
    await expect(modal).toContainText('53');
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await modalRoot(page)
      .getByRole('button', { name: 'Закрыть' })
      .click();

    await expect(
      modalRoot(page).getByRole('heading', { name: 'Детали ингредиента' })
    ).toHaveCount(0);
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await modalOverlay(page).click({ position: { x: 5, y: 5 } });

    await expect(
      modalRoot(page).getByRole('heading', { name: 'Детали ингредиента' })
    ).toHaveCount(0);
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page);
    await mockUser(page);
    await mockOrders(page);
    await mockIngredients(page);
    await page.goto('/');
    await addButton(page, BUN_ID).click();
    await addButton(page, MAIN_ID).click();
  });

  test('заказ оформляется: номер верный, конструктор очищается, модалка закрывается', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(orderModalCaption(page)).toBeVisible();
    await expect(modalRoot(page).locator('.text_type_digits-large')).toHaveText('4242');

    await modalRoot(page).getByRole('button', { name: 'Закрыть' }).click();

    await expect(orderModalCaption(page)).toHaveCount(0);
    await expect(modalRoot(page).locator('.text_type_digits-large')).toHaveCount(0);

    await expect(constructorElements(page)).toHaveCount(0);
  });
});
