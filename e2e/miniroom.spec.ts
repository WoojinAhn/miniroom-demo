import { test, expect } from "@playwright/test";

test.describe("Page Load & Rendering", () => {
  test("page loads with canvas and inventory visible", async ({ page }) => {
    await page.goto("/");

    // Header
    await expect(page.locator("h1").filter({ hasText: "Miniroom Maker" })).toBeVisible();

    // Canvas area — character image proves canvas rendered
    await expect(page.locator('img[alt="Character 01"]')).toBeVisible();

    // Inventory sections
    await expect(page.getByRole("heading", { name: "Special Items" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "General Items" })).toBeVisible();
  });

  test("default character is present in the room", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('img[alt="Character 01"]')).toBeVisible();
  });

  test("background selector is rendered with all options", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Grass Field" })).toBeVisible();
    await expect(page.getByRole("button", { name: "My Room" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Universe" })).toBeVisible();
  });
});

test.describe("Inventory & Item Placement", () => {
  test("characters are not shown in the inventory", async ({ page }) => {
    await page.goto("/");

    // Inventory section — characters should not appear as buttons
    const inventory = page.locator("main").locator("> div").last();
    await expect(inventory.locator('img[alt="Character 01"]')).not.toBeVisible();
  });

  test("clicking an inventory item adds it to the canvas", async ({ page }) => {
    await page.goto("/");

    // Count initial items in the canvas (the inner positioned container's children)
    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const initialCount = await canvasInner.locator("> div").count();

    // Click first inventory item
    await page.getByRole("button", { name: "Book Purple" }).first().click();

    // Should have one more item in canvas
    const newCount = await canvasInner.locator("> div").count();
    expect(newCount).toBe(initialCount + 1);
  });
});

test.describe("Item Selection & Toolbar", () => {
  test("clicking an item selects it with blue outline", async ({ page }) => {
    await page.goto("/");

    // Click the default character image
    await page.locator('img[alt="Character 01"]').click({ force: true });

    // The outermost draggable div (grandparent of img) should have blue outline
    const draggable = page.locator('img[alt="Character 01"]').locator("..").locator("..");
    await expect(draggable).toHaveCSS("outline-color", "rgb(59, 130, 246)");
  });

  test("clicking canvas background deselects item", async ({ page }) => {
    await page.goto("/");

    // Select the character
    await page.locator('img[alt="Character 01"]').click({ force: true });
    const draggable = page.locator('img[alt="Character 01"]').locator("..").locator("..");
    await expect(draggable).toHaveCSS("outline-color", "rgb(59, 130, 246)");

    // Click the canvas background (top-left corner to avoid items)
    const canvasInner = page.locator("main").locator("[style*='background']").first();
    await canvasInner.click({ position: { x: 5, y: 5 }, force: true });

    // Outline should be gone
    await expect(draggable).toHaveCSS("outline-style", "none");
  });

  test("selected item shows toolbar on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    await page.locator('img[alt="Character 01"]').click({ force: true });

    await expect(page.getByTitle("Rotate")).toBeVisible();
    await expect(page.getByTitle("Flip")).toBeVisible();
    await expect(page.getByTitle("Zoom In")).toBeVisible();
    await expect(page.getByTitle("Zoom Out")).toBeVisible();
    await expect(page.getByTitle("Bring Forward")).toBeVisible();
    await expect(page.getByTitle("Send Backward")).toBeVisible();
    await expect(page.getByTitle("Delete")).toBeVisible();
  });
});

test.describe("Item Transformation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await page.locator('img[alt="Character 01"]').click({ force: true });
  });

  test("rotate button rotates item by 90 degrees", async ({ page }) => {
    const draggable = page.locator('img[alt="Character 01"]').locator("..").locator("..");

    const initialStyle = await draggable.getAttribute("style");
    expect(initialStyle).toContain("rotate(0deg)");

    await page.getByTitle("Rotate").click();

    const newStyle = await draggable.getAttribute("style");
    expect(newStyle).toContain("rotate(90deg)");
  });

  test("flip button flips item horizontally", async ({ page }) => {
    // Inner div (direct parent of img) handles flip
    const innerDiv = page.locator('img[alt="Character 01"]').locator("..");

    const initialStyle = await innerDiv.getAttribute("style");
    expect(initialStyle).toContain("scaleX(1)");

    await page.getByTitle("Flip").click();

    const newStyle = await innerDiv.getAttribute("style");
    expect(newStyle).toContain("scaleX(-1)");
  });

  test("scale up increases item size", async ({ page }) => {
    const draggable = page.locator('img[alt="Character 01"]').locator("..").locator("..");

    const initialStyle = await draggable.getAttribute("style");
    expect(initialStyle).toContain("scale(1)");

    await page.getByTitle("Zoom In").click();

    const newStyle = await draggable.getAttribute("style");
    expect(newStyle).toContain("scale(1.1)");
  });

  test("scale down decreases item size", async ({ page }) => {
    const draggable = page.locator('img[alt="Character 01"]').locator("..").locator("..");

    await page.getByTitle("Zoom Out").click();

    const newStyle = await draggable.getAttribute("style");
    expect(newStyle).toContain("scale(0.9)");
  });
});

test.describe("Item Deletion", () => {
  test("double-click deletes a non-character item", async ({ page }) => {
    await page.goto("/");

    // Place an item first
    await page.getByRole("button", { name: "Book Purple" }).first().click();

    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const countAfterPlace = await canvasInner.locator("> div").count();

    // Double-click the last placed item (newest = last in DOM)
    const lastItem = canvasInner.locator("> div").last();
    await lastItem.dblclick();

    const countAfterDelete = await canvasInner.locator("> div").count();
    expect(countAfterDelete).toBe(countAfterPlace - 1);
  });

  test("double-click does NOT delete a character", async ({ page }) => {
    await page.goto("/");

    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const countBefore = await canvasInner.locator("> div").count();

    // Double-click the character
    await page.locator('img[alt="Character 01"]').dblclick({ force: true });

    const countAfter = await canvasInner.locator("> div").count();
    expect(countAfter).toBe(countBefore);
  });
});

test.describe("Background Selection", () => {
  test("changing background updates the canvas", async ({ page }) => {
    await page.goto("/");

    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const initialStyle = await canvasInner.getAttribute("style");

    // Default is "My Room" — switch to "Grass Field"
    await page.getByRole("button", { name: "Grass Field" }).click();

    const newStyle = await canvasInner.getAttribute("style");
    expect(newStyle).toContain("bg_grass.png");
    expect(newStyle).not.toEqual(initialStyle);
  });

  test("active background button is highlighted", async ({ page }) => {
    await page.goto("/");

    // Default is "My Room"
    const myRoomBtn = page.getByRole("button", { name: "My Room" });
    await expect(myRoomBtn).toHaveClass(/bg-blue-600/);

    // Switch to Universe
    await page.getByRole("button", { name: "Universe" }).click();

    const universeBtn = page.getByRole("button", { name: "Universe" });
    await expect(universeBtn).toHaveClass(/bg-blue-600/);
    await expect(myRoomBtn).not.toHaveClass(/bg-blue-600/);
  });
});

test.describe("Drag & Drop", () => {
  test("dragging an item moves it to a new position", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Place an item
    await page.getByRole("button", { name: "Book Purple" }).first().click();

    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const placedItem = canvasInner.locator("> div").last();

    const initialStyle = await placedItem.getAttribute("style");
    const initialLeft = initialStyle?.match(/left:\s*([\d.]+)/)?.[1];

    // Drag the item
    const box = await placedItem.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 30, {
        steps: 5,
      });
      await page.mouse.up();
    }

    const newStyle = await placedItem.getAttribute("style");
    const newLeft = newStyle?.match(/left:\s*([\d.]+)/)?.[1];
    expect(newLeft).not.toBe(initialLeft);
  });
});

test.describe("Layer Ordering", () => {
  test("bring forward changes item order in DOM", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Place two items
    await page.getByRole("button", { name: "Book Purple" }).first().click();
    await page.getByRole("button", { name: "Rocket" }).first().click();

    const canvasInner = page.locator("main").locator("[style*='background']").first();
    const totalItems = await canvasInner.locator("> div").count();

    // Select the second-to-last item
    const secondToLast = canvasInner.locator("> div").nth(totalItems - 2);
    const imgBefore = await secondToLast.locator("img").getAttribute("alt");
    await secondToLast.click();

    // Bring it forward
    await page.getByTitle("Bring Forward").click();

    // Now it should be the last item
    const lastItem = canvasInner.locator("> div").nth(totalItems - 1);
    const imgAfter = await lastItem.locator("img").getAttribute("alt");
    expect(imgAfter).toBe(imgBefore);
  });
});

test.describe("Screenshot Export", () => {
  test("downloaded image matches canvas dimensions exactly", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Listen for the download event
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    // Save to temp path and read the PNG dimensions
    const path = await download.path();
    expect(path).toBeTruthy();

    // Read PNG header to get image dimensions (bytes 16-23 contain width and height as 4-byte big-endian)
    const fs = require("fs");
    const buffer = fs.readFileSync(path);
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(18) || buffer.readUInt32BE(20);

    // Default background is "My Room" (750x606)
    // PNG header: bytes 16-19 = width, bytes 20-23 = height
    const pngWidth = buffer.readUInt32BE(16);
    const pngHeight = buffer.readUInt32BE(20);
    expect(pngWidth).toBe(750);
    expect(pngHeight).toBe(606);
  });
});
