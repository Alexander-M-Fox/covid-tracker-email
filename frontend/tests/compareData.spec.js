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

    // await page.locator('.plus>>nth=0').click();
    // await page.locator('.plus>>nth=1').click();

    // const text1 = await page.locator('.bottomBar>>p>>nth=0');
    // const text2 = await page.locator('.bottomBar>>p>>nth=1');
    // expect(text1).toContainText('uk');
    // expect(text2).toContainText('ukraine');
});
