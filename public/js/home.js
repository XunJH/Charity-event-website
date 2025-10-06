document.addEventListener("DOMContentLoaded", async () => {
  const eventsListEl = document.getElementById("events-list");
  try {
    console.log("Start requesting activity data. Interface address: /home/events");
    const events = await CharityCommon.fetchApi("/home/events");
    
    console.log("Data request successful. Data returned:", events);
    if (!Array.isArray(events)) {
      throw new Error("The data format returned by the interface is incorrect. The expected format is an array.");
    }

    if (events.length === 0) {
      eventsListEl.innerHTML = `
        <div class="empty-state">
          <i class="fa fa-calendar-o"></i>
          <p>There are no upcoming charity events at present</p>
        </div>
      `;
      return;
    }

    eventsListEl.innerHTML = events.map(event => {
      const currentFunds = Number(event.current_funds) || 0;
      const fundraisingGoal = Number(event.fundraising_goal) || 0;
      const ticketPrice = Number(event.ticket_price) || 0;
      const progressPercent = fundraisingGoal > 0 
        ? Math.round((currentFunds / fundraisingGoal) * 100) 
        : 0;

      return `
        <div class="event-card">
          <img src="${CharityCommon.getSafeImageUrl(event.image_url)}" alt="${event.title || 'Activity pictures'}" class="event-card-img">
          <div class="event-card-content">
            <h3 class="event-card-title">
              <a href="event-detail.html?id=${event.event_id}">${event.title || 'Unnamed Activity'}</a>
            </h3>
            <div class="event-card-meta">
              <span><i class="fa fa-tags"></i> ${event.category_name || 'not classified'}</span>
              <span><i class="fa fa-calendar"></i> ${CharityCommon.formatDate(event.event_date) || 'Date not determined'}</span>
              <span><i class="fa fa-map-marker"></i> ${event.location || 'Location not determined'}</span>
            </div>
            <p class="event-card-desc">${event.description || 'No activity description available.'}</p>
            <div class="event-card-progress">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            <div class="event-card-progress-text">
              <span>Fundraising progress：${progressPercent}%</span>
              <span>¥${currentFunds.toFixed(2)}/${fundraisingGoal.toFixed(2)}</span>
            </div>
            <div class="event-card-price">
              ticket rates：${ticketPrice > 0 ? `¥${ticketPrice.toFixed(2)}` : "free of charge"}
            </div>
            <a href="event-detail.html?id=${event.event_id}" class="btn btn-view-detail">view details</a>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("===== Activity loading failed details =====");
    console.error("type of error:", err.name);
    console.error("error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("===========================");
    
    eventsListEl.innerHTML = `
      <div class="error-state">
        <i class="fa fa-exclamation-triangle"></i>
        <p>The activity loading failed. Please try again later.</p>
      </div>
    `;
  }
});