// @ts-check
import { test, expect } from '@playwright/test';

test('compare country data', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Expect a searchBar to read 'enter country'
    const searchBar = page.locator('.searchBar >> input');
    await expect(searchBar).toHaveAttribute('placeholder', 'enter country');

    // Enter country and add to compare list
    await searchBar.click();
    await searchBar.fill('uk');
    const plusBtns = await page.locator('.plus');
    await expect(await plusBtns.count()).toBe(2);

    // for (const plusSign of await page.locator('.plus').all()) {
    //     await plusSign.click(); // unsure as to whether this is currently working
    // }

    // const bottomBar = await page.locator('.bottomBar');
    // expect(bottomBar).toContainText('uk');
    // expect(bottomBar).toContainText('ukraine');
});
