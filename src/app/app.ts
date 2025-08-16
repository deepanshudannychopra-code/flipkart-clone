import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { ToasterComponent } from "./components/toaster/toaster.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, ToasterComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = "Flipkart Clone - Shop Online";
}
