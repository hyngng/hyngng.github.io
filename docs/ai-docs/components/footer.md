# Footer Component Architecture

## Design Philosophy
The Footer is defined as a **layout component**. In this project's architecture, layout components are responsible for the precise positioning and spacing of their child elements, bypassing browser-default behaviors (like paragraph margins) that are primarily designed for document flow.

## Spacing Logic
By enforcing `margin: 0` on child elements within the footer and utilizing Flexbox `gap` on the parent container, we ensure that spacing is determined exclusively by the parent. 

This approach is chosen for the following reasons:
- **Separation of Concerns**: Layout components dictate the structure; text elements within them relinquish their intrinsic spacing responsibilities.
- **Architectural Predictability**: It prevents additive spacing issues (where `gap` + `margin` create unexpected gaps) and guarantees a consistent design system.
- **Maintainability**: Future adjustments to the layout spacing can be made in one place (the parent container's `gap` property) without side effects from child element styles.
