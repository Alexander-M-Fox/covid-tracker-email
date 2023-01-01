import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    // init
    await page.goto('http://localhost:3000/');

    // select 4 countries (uk, ukraine, france and germany)
    await page.getByPlaceholder('enter country').click();
    await page.getByPlaceholder('enter country').fill('uk');
    await page.getByRole('button', { name: '+' }).first().click();
    await page.getByRole('button', { name: '+' }).nth(1).click();
    await page.getByPlaceholder('uk').click();
    await page.getByRole('textbox').fill('fra');
    await page.getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('fra').click();
    await page.getByRole('textbox').fill('ger');
    await page.getByRole('button', { name: '+' }).nth(1).click();

    // check all 4 countries appear in bottom bar
    await expect(await page.getByText('uk').first()).toHaveText('ukabcd'); // deliberate breakage
    await expect(await page.getByText('ukraine')).toHaveText('ukraine');
    await expect(await page.getByText('france')).toHaveText('france');
    await expect(await page.getByText('germany').nth(1)).toHaveText('germany');

    await page.getByRole('button', { name: 'next' }).click();

    // confirm headings show on compare page
    await expect(await page.getByRole('heading', { name: 'uk' }).first()).toHaveText('uk');
    await expect(await page.getByText('new data').first()).toHaveText('new data');
    await expect(await page.getByText('total data').first()).toHaveText('total data');
    await expect(await page.getByRole('heading', { name: 'ukraine' })).toHaveText('ukraine');
    await expect(await page.getByText('new data').nth(1)).toHaveText('new data');
    await expect(await page.getByText('total data').nth(1)).toHaveText('total data');
    await expect(await page.getByRole('heading', { name: 'france' })).toHaveText('france');
    await expect(await page.getByText('new data').nth(2)).toHaveText('new data');
    await expect(await page.getByText('total data').nth(2)).toHaveText('total data');
    await expect(await page.getByRole('heading', { name: 'germany' })).toHaveText('germany');
    await expect(await page.getByText('new data').nth(3)).toHaveText('new data');
    await expect(await page.getByText('total data').nth(3)).toHaveText('total data');
});
