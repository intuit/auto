class Auto < Formula
  desc "Generate releases based on semantic version labels on pull requests."
  homepage "https://intuit.github.io/auto"
  url "https://github.com/intuit/auto/releases/download/v10.46.0/auto-macos.gz"
  version "v10.46.0"
  sha256 "df60fd75f98120efd9179903a1595c8320e73e8cb89492b8d7b0a10eb43f8d81"

  def install
    libexec.install Dir["*"]
    bin.install libexec/"auto-macos"
    mv bin/"auto-macos", bin/"auto"
  end

  test do
    system bin/"auto", "--version"
  end
end