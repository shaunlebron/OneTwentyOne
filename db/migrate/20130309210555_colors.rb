class Colors < ActiveRecord::Migration
  def change
    create_table :colors do |t|
      t.string :name, limit: 50
      t.integer :hex
    end
  end
end
