export default function Table() {
    return (
        <div className="w-full overflow-x-auto">
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover">
        <td className="text-nowrap">John Doe</td>
        <td>johndoe@example.com</td>
        <td><span className="badge badge-soft badge-success text-xs">Professional</span></td>
        <td className="text-nowrap">March 1, 2024</td>
        <td>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--pencil] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--trash] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--dots-vertical] size-5"></span></button>
        </td>
      </tr>
      <tr className="hover">
        <td className="text-nowrap">Jane Smith</td>
        <td>janesmith@example.com</td>
        <td><span className="badge badge-soft badge-error text-xs">Rejected</span></td>
        <td className="text-nowrap">March 2, 2024</td>
        <td>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--pencil] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--trash] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--dots-vertical] size-5"></span></button>
        </td>
      </tr>
      <tr className="hover">
        <td className="text-nowrap">Alice Johnson</td>
        <td>alicejohnson@example.com</td>
        <td><span className="badge badge-soft badge-info text-xs">Applied</span></td>
        <td className="text-nowrap">March 3, 2024</td>
        <td>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--pencil] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--trash] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--dots-vertical] size-5"></span></button>
        </td>
      </tr>
      <tr className="hover">
        <td className="text-nowrap">Bob Brown</td>
        <td>bobrown@example.com</td>
        <td><span className="badge badge-soft badge-primary text-xs">Current</span></td>
        <td className="text-nowrap">March 4, 2024</td>
        <td>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--pencil] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--trash] size-5"></span></button>
          <button className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--dots-vertical] size-5"></span></button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
    )
}
