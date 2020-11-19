class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.4.0/auto-macos.gz"
  version "v10.4.0"
  sha256 "769b383f518c99132b4381bf842058e8a9abfc9a4ede40e6eb4665f90d0ae22f"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end