import { expect, test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Page } from '@playwright/test';

const HARS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'hars');

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

const ingredientCard = (page: Page, name: string) =>
  page.locator('li', { hasText: name }).first();

const addButton = (page: Page, name: string) =>
  ingredientCard(page, name).getByRole('button', { name: 'Добавить' });

const modalRoot = (page: Page) => page.locator('#modals');
const modalOverlay = (page: Page) => page.locator('[class*="modal-overlay"]');

const constructorElement = (page: Page, name: string) =>
  page.locator('.constructor-element').filter({ hasText: name });

test.describe('Добавление ингредиентов в конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
  });

  test('булка добавляется в конструктор дважды (сверху и снизу)', async ({
    page
  }) => {
    await addButton(page, BUN_NAME).click();

    await expect(constructorElement(page, BUN_NAME)).toHaveCount(2);
  });

  test('начинка добавляется в конструктор один раз', async ({ page }) => {
    await addButton(page, BUN_NAME).click();
    await addButton(page, MAIN_NAME).click();

    await expect(constructorElement(page, MAIN_NAME)).toHaveCount(1);
    await expect(constructorElement(page, BUN_NAME)).toHaveCount(2);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockIngredients(page);
    await page.goto('/');
    await ingredientCard(page, BUN_NAME).click();
  });

  test('открывается по клику на ингредиент и показывает данные этого ингредиента', async ({
    page
  }) => {
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
    await expect(modalRoot(page).getByRole('heading', { name: BUN_NAME })).toBeVisible();
    await expect(modalRoot(page)).toContainText('420');
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(0);
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await modalOverlay(page).click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(0);
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page);
    await mockUser(page);
    await mockOrders(page);
    await mockIngredients(page);
    await page.goto('/');
    await addButton(page, BUN_NAME).click();
    await addButton(page, MAIN_NAME).click();
  });

  test('заказ оформляется: номер верный, конструктор очищается, модалка закрывается', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(modalRoot(page)).toContainText('4242');

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(0);
  });
});
