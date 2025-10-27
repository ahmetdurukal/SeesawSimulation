## Thought Process and Design Decisions

My first goal was to draw a seesaw on the page. I created the container structure for the plank and pivot sections. Then, I made the plank area clickable and enabled object generation upon clicking. At this stage, the created objects did not yet have defined weights, sizes, or any seesaw movement.

I wanted to keep log records, so I added a log box to the lower section of the layout. Afterwards, I implemented torque calculations for fixed weights to enable the seesaw’s motion. I then integrated the weight system and scaling logic into the program.

Once I displayed the collected information in the info box, the basic version of the project was complete. Finally, I enhanced the experience by adding random weight generation, color-coded balls labeled with their weights, and sound effects to finalize the design.

## Challenges and Trade-offs

### Event Bubbling

* **Issue:** When clicking on existing balls on the plank, the event bubbled up and triggered the plank’s click listener, causing unwanted new balls to appear.
* **Solution:** Added a condition to ensure only direct clicks on the plank would trigger the creation of new balls.

### Reset Requirement

* **Issue:** Without a reset button, adding many balls caused the interface to become cluttered, and because of localStorage, even reloading the page did not clear the data.
* **Solution:** Introduced a reset button that clears both the display and localStorage.

### Click Alignment

* **Issue:** The balls were not landing exactly at the clicked position on the plank.
* **Solution:** Adjusted the position calculation so that each ball drops relative to the center of the plank, ensuring accurate alignment.

## AI Support

* Understanding and resolving the event bubbling issue
* Clarifying the positive/negative torque conversion in balance calculations
* Adjusting alignment logic when objects were not landing at the correct click position