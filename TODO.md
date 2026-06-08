# TODO - Fix restaurantId propagation for Customer menu

- [x] Update server menuController.js to remove hardcoded 'demo' restaurant bypass.

- [ ] Update any client QR/menu URL generation logic that may use /menu/demo (verified via buildMenuUrl).
- [ ] Ensure CustomerMenuPage uses the same restaurantId from route params (/menu/:restaurantId) and loads correct items.
- [ ] Verify client-side cart/menu add uses correct restaurantId (already passes restaurantId).
- [ ] Provide a list of every changed file and exact before/after code.

