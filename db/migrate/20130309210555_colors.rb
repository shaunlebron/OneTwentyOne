class Colors < ActiveRecord::Migration
  def change
    create_table :colors do |t|
      t.string :name, limit: 50
      t.string :hex, limit: 7
    end
  end
end
